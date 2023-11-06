import {createContext, useContext, useRef} from "react";

const TrackCuesContext = createContext({
    chapterCuesRef: null, captionCuesRef: null,
});

export function TrackCuesContextProvider({children}) {
    const init = {root: null, children: null, cues: null, autoScroll: false};
    const chapterCuesRef = useRef(init);
    const captionCuesRef = useRef(init);

    return (
        <TrackCuesContext.Provider value={{chapterCuesRef, captionCuesRef}}>
            {children}
        </TrackCuesContext.Provider>
    );
}

export default function useTrackCues() {
    const {chapterCuesRef, captionCuesRef} = useContext(TrackCuesContext);

    function setChapterCues(root, cues, autoScroll) {
        const children = root?.querySelectorAll('.chapter-cue');
        chapterCuesRef.current = {root, children, cues, autoScroll};
    }

    function setCaptionCues(root, cues, autoScroll) {
        const children = root?.querySelectorAll('.caption-cue');
        captionCuesRef.current = {root, children, cues, autoScroll};
    }

    function setCurrentTime(currentTime) {
        if (chapterCuesRef.current?.root)
            setCurrentTimeForRef(chapterCuesRef.current, currentTime);

        if (captionCuesRef.current?.root)
            setCurrentTimeForRef(captionCuesRef.current, currentTime);
    }

    return [setChapterCues, setCaptionCues, setCurrentTime];
};

function setCurrentTimeForRef(ref, currentTime) {
    ref.children.forEach(elem => elem.classList.remove('bg-diploblue-50', 'rounded'));

    const idx = ref.cues.findIndex(cue => cue.startTime <= currentTime && currentTime < cue.endTime);
    if (idx >= 0) {
        ref.children[idx].classList.add('bg-diploblue-50', 'rounded');
        if (ref.autoScroll)
            ref.root.scrollTop = ref.children[idx].offsetTop - ref.root.offsetTop - 50;
    }
}
