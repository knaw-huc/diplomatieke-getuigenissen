import {useEffect, useRef} from "react";
import {getDuration, getHash} from "../misc/utils.js";
import {BookmarkIcon} from "../misc/icons.jsx";
import {Spinner} from "../misc/loading.jsx";
import useTrackCues from "../hooks/useTrackCues.jsx";

export default function Chapters({cues}) {
    const chaptersRef = useRef(null);
    const [setChapterCues, setCaptionCues, setCurrentTime] = useTrackCues();

    useEffect(_ => {
        setChapterCues(chaptersRef.current, cues, false);
    });

    return (
        <div className="mt-4">
            {cues.length === 0 ? <div className="flex justify-center">
                <Spinner/>
            </div> : <ul className="flex flex-col gap-1" ref={chaptersRef}>
                {cues.map(cue => <ChapterCue key={cue.id} cue={cue}/>)}
            </ul>}
        </div>
    );
}

function ChapterCue({cue}) {
    return (
        <li className="flex flex-row items-center justify-start chapter-cue">
            <span className="mx-3">
                <BookmarkIcon className="w-4 h-4 fill-diploBlue-700"/>
            </span>

            <a href={getHash(cue.startTime)} className="font-mono text-base mr-3">
                {getDuration(cue.startTime)}
            </a>

            {cue.text}
        </li>
    );
}
