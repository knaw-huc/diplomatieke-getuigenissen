import {useRef, useEffect, forwardRef, useState} from "react";
import {getDuration, getDurationInPercentage, getHash, getHashData} from "../misc/utils.js";
import {Spinner} from "../misc/loading.jsx";
import {getApiBase} from "../misc/config.js";
import {BookmarkIcon, CaptionsIcon, FullScreenIcon, PauseIcon, PlayIcon, SoundIcon, MuteIcon} from "../misc/icons.jsx";

export default function Video({id, session, onTimeUpdate, onCaptionsLoaded, onChaptersLoaded}) {
    const playerRef = useRef(null);
    const videoRef = useRef(null);
    const captionsRef = useRef(null);
    const chaptersRef = useRef(null);
    const progressRef = useRef(null);
    const timeElapsedRef = useRef(null);
    const jumpedTimeRef = useRef(null); // TODO: Only to deal with Safari bug

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [chapters, setChapters] = useState([]);

    const videoSrc = `${getApiBase()}/video/${id}/${session}`;
    const posterSrc = `${getApiBase()}/thumbnail/${id}/${session}`;
    const captionsSrc = `${getApiBase()}/captions/${id}/${session}`;
    const chaptersSrc = `${getApiBase()}/chapters/${id}/${session}`;

    function jumpToTime() {
        const time = getHashData().t;
        videoRef.current.currentTime = getHashData().t;
        jumpedTimeRef.current = time;
    }

    function initVideo() {
        if (captionsRef.current.track.mode === 'disabled')
            captionsRef.current.track.mode = 'hidden';

        if (chaptersRef.current.track.mode === 'disabled')
            chaptersRef.current.track.mode = 'hidden';

        setDuration(videoRef.current.duration);
        jumpToTime();
    }

    function updateTimeElapsed() {
        let currentTime = videoRef.current.currentTime;

        // TODO: Safari bug, sometimes shows 0 instead of jumped time
        if (jumpedTimeRef.current !== null) {
            if (jumpedTimeRef.current !== currentTime)
                currentTime = jumpedTimeRef.current;

            jumpedTimeRef.current = null;
        }

        const durationStr = getDuration(currentTime);
        timeElapsedRef.current.innerText = durationStr;
        timeElapsedRef.current.setAttribute('datetime', durationStr);

        progressRef.current.style.width = `${getDurationInPercentage(currentTime, videoRef.current.duration)}%`;

        if (onTimeUpdate)
            onTimeUpdate(currentTime);
    }

    function onLoading() {
        setIsLoading(true);
        setHasError(false);
    }

    function onLoadingFinished() {
        setIsLoading(false);
        setHasError(false);
    }

    function onError() {
        setIsLoading(false);
        setHasError(true);
    }

    function captionsLoaded() {
        const captions = Array.from(captionsRef.current.track.cues);
        onCaptionsLoaded(captions);
    }

    function chaptersLoaded() {
        const chapters = Array.from(chaptersRef.current.track.cues);
        setChapters(chapters);
        onChaptersLoaded(chapters);
    }

    function skipToTime(time) {
        videoRef.current.currentTime = time;
        jumpedTimeRef.current = time;
    }

    function togglePlay() {
        if (videoRef.current.paused || videoRef.current.ended)
            videoRef.current.play();
        else
            videoRef.current.pause();
    }

    function toggleSound() {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    }

    function toggleCaptions() {
        captionsRef.current.track.mode = (captionsRef.current.track.mode === 'showing') ? 'hidden' : 'showing';
    }

    function toggleFullScreen() {
        if (document.fullscreenElement)
            document.exitFullscreen();
        else
            playerRef.current.requestFullscreen();
    }

    useEffect(_ => {
        if (videoRef.current?.currentSrc !== videoSrc) {
            onCaptionsLoaded([]);
            onChaptersLoaded([]);

            // TODO: Workaround for bug in Firefox not loading tracks after update
            captionsRef.current.src = '';
            captionsRef.current.src = captionsSrc;
            chaptersRef.current.src = '';
            chaptersRef.current.src = chaptersSrc;

            setIsPlaying(false);
            videoRef.current.pause();
            videoRef.current.load();
        }

        window.addEventListener('hashchange', jumpToTime);
        captionsRef.current?.addEventListener('load', captionsLoaded);
        chaptersRef.current?.addEventListener('load', chaptersLoaded);

        return _ => {
            window.removeEventListener('hashchange', jumpToTime);
            captionsRef.current?.removeEventListener('load', captionsLoaded);
            chaptersRef.current?.removeEventListener('load', chaptersLoaded);
        };
    }, [id, session]);

    return (
        <div className="w-full relative" ref={playerRef}>
            {(isLoading || hasError) && (
                <div className="w-full absolute flex flex-col justify-center items-center h-full z-10">
                    {isLoading && <Spinner/>}
                    {hasError && <span className="text-white bg-diploblue-700 bg-opacity-60 rounded px-1">
                        De video van dit interview kan helaas niet afgespeeld worden!
                    </span>}
                </div>
            )}

            <video className="w-full" poster={posterSrc} preload="metadata" crossOrigin="anonymous"
                   onClick={togglePlay} onLoadedMetadata={initVideo} onTimeUpdate={updateTimeElapsed}
                   onLoadStart={onLoading} onSeeking={onLoading}
                   onCanPlay={onLoadingFinished} onSeeked={onLoadingFinished} onError={onError}
                   onContextMenu={_ => false}
                   onPlay={_ => setIsPlaying(true)}
                   onPause={_ => setIsPlaying(false)}
                   ref={videoRef}>
                <source type="video/mp4" src={videoSrc}/>
                <track kind="captions" src={captionsSrc} srcLang="nl" label="Nederlands" ref={captionsRef}/>
                <track kind="chapters" src={chaptersSrc} srcLang="nl" label="Hoofdstukken" ref={chaptersRef}/>
            </video>

            <ProgressBarRef duration={duration} skipToTime={skipToTime} ref={progressRef}/>

            <ContextBar duration={duration} chapters={chapters}/>

            <ControlsRef isPlaying={isPlaying} isMuted={isMuted} duration={duration} togglePlay={togglePlay}
                         toggleSound={toggleSound} toggleCaptions={toggleCaptions} toggleFullScreen={toggleFullScreen}
                         ref={timeElapsedRef}/>
        </div>
    );
}

const ProgressBarRef = forwardRef(function ProgressBar({duration, skipToTime}, ref) {
    function onSkipToTime(e) {
        const target = e.target.classList.contains('progressbar') ? e.target : e.target.parentElement;
        const offsetLeft = target.offsetParent.offsetLeft === 0
            ? target.offsetParent.offsetParent.offsetLeft
            : target.offsetParent.offsetLeft;
        const position = (e.pageX - offsetLeft) / target.offsetWidth;
        const newTime = position * duration;
        skipToTime(newTime);
    }

    return (
        <div className="progressbar w-full bg-diploblue-900 h-2 flex items-center cursor-pointer group"
             onClick={onSkipToTime}>
            <div className="bg-diploblue-500 h-[2px] group-hover:h-2 transition-all" ref={ref}/>
        </div>
    );
});

function ContextBar({duration, chapters}) {
    return (
        <div className="bg-diploblue-900 h-6 w-full relative">
            {duration > 0 && chapters && chapters.map(cue =>
                <button key={`ch${cue.id}`} className="mt-1 absolute"
                        style={{'marginLeft': `${getDurationInPercentage(cue.startTime, duration)}%`}}
                        title={cue.text} onClick={_ => window.location.hash = getHash(cue.startTime)}>
                    <BookmarkIcon className="w-3 h-3 fill-blueGrey-200"/>
                </button>
            )}

            {/*<button className="ml-[15%] mt-1 absolute">*/}
            {/*    <SearchIcon className="w-4 h-4 fill-pink-200 -ml-4"/>*/}
            {/*</button>*/}
        </div>
    );
}

const ControlsRef = forwardRef(function Controls({
                                                     isPlaying,
                                                     isMuted,
                                                     duration,
                                                     togglePlay,
                                                     toggleSound,
                                                     toggleCaptions,
                                                     toggleFullScreen
                                                 }, ref) {
    const durationStr = getDuration(duration);

    return (
        <div
            className="grid grid-flow-col justify-stretch content-center items-center bg-diploblue-700 w-full px-6 py-2">
            <div className="text-white">
                <time ref={ref}>00:00:00</time>
                <span className="text-xs ml-1">/ <time dateTime={durationStr}>{durationStr || '00:00'}</time></span>
            </div>

            <div className="flex justify-center">
                <div className="cursor-pointer" onClick={togglePlay}>
                    {!isPlaying && <PlayIcon className="w-6 h-6 fill-white"/>}
                    {isPlaying && <PauseIcon className="w-6 h-6 fill-white"/>}
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <div className="cursor-pointer" onClick={toggleSound}>
                    {!isMuted && <SoundIcon className="w-4 h-4 fill-white"/>}
                    {isMuted && <MuteIcon className="w-4 h-4 fill-white"/>}
                </div>

                <div className="cursor-pointer" onClick={toggleCaptions}>
                    <CaptionsIcon className="w-4 h-4 stroke-white"/>
                </div>

                <div className="cursor-pointer" onClick={toggleFullScreen}>
                    <FullScreenIcon className="w-4 h-4 fill-white"/>
                </div>
            </div>
        </div>
    );
});
