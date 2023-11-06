import {useEffect, useRef, useState} from "react";
import useTrackCues from "../hooks/useTrackCues.jsx";
import {getHash} from "../misc/utils.js";
import {GhostLines} from "../misc/loading.jsx";

export default function Transcription({chapters, captions}) {
    const transcriptRef = useRef(null);
    const [useAutoScroll, setUseAutoScroll] = useState(true);
    const [setChapterCues, setCaptionCues, setCurrentTime] = useTrackCues();

    const chaptersIter = chapters.values();
    const captionsIter = captions.values();

    let curChapter = chaptersIter.next();
    let curCaption = captionsIter.next();

    function* createTranscriptCue() {
        while (!curChapter.done || !curCaption.done) {
            if (!curChapter.done && (curCaption.done || (curChapter.value.startTime <= curCaption.value.startTime))) {
                yield <TranscriptChapterCue key={`ch${curChapter.value.id}`} cue={curChapter.value}/>;
                curChapter = chaptersIter.next();
            }
            else {
                yield <TranscriptCaptionCue key={`ca${curCaption.value.id}`} cue={curCaption.value}/>;
                curCaption = captionsIter.next();
            }
        }
    }

    function toggleAutoScroll() {
        setUseAutoScroll(useAutoScroll => !useAutoScroll);
    }

    useEffect(_ => {
        setCaptionCues(transcriptRef.current, captions, useAutoScroll);
    });

    return (
        <>
            <div className="text-sm flex justify-end text-neutral-600 mb-1">
                <label>
                    <input type="checkbox" className="mr-1 accent-diploblue-700"
                           checked={useAutoScroll} onChange={toggleAutoScroll}/>
                    Tekst loopt mee met video
                </label>
            </div>

            {captions.length === 0 ? <div className="mt-2">
                <GhostLines/>
            </div> : <div className="overflow-y-auto h-screen" ref={transcriptRef}>
                {[...createTranscriptCue()]}
            </div>}
        </>
    );
};

function TranscriptChapterCue({cue}) {
    return (
        <p className="mt-2 mb-2 font-bold">
            {cue.text}
        </p>
    );
}

function TranscriptCaptionCue({cue}) {
    let voice = null;
    let line = cue.text;
    if (cue.text.startsWith('<v ')) {
        voice = cue.text.substring(3, cue.text.indexOf('>'));
        line = cue.text.substring(cue.text.indexOf('>') + 1);
    }

    return (
        <>
            {voice && <p className="mt-2 text-sm text-gray-600">
                ({voice})
            </p>}

            <p className="inline caption-cue cursor-pointer py-1"
               onClick={_ => window.location.hash = getHash(cue.startTime)}>
                {line}
            </p>

            {' '}
        </>
    );
}
