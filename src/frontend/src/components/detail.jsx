import {useEffect, useState} from "react";
import {useLoaderData, useNavigate, useNavigation} from "react-router-dom";
import useTrackCues, {TrackCuesContextProvider} from "../hooks/useTrackCues.jsx";
import Interviews from "./interviews.jsx";
import Bibliografie from "./bibliografie.jsx";
import Stationeringen from "./stationeringen.jsx";
import Video from "./video.jsx";
import Chapters from "./chapters.jsx";
import Transcription from "./transcript.jsx";
import {ArrowLeftIcon} from "../misc/icons.jsx";
import {getHashData, getNLDate} from "../misc/utils.js";
import {Spinner} from "../misc/loading.jsx";
import {getApiBase} from "../misc/config.js";

export async function detailLoader({params}) {
    return fetch(`${getApiBase()}/detail/${params.id}`);
}

export default function Detail() {
    const navigation = useNavigation();
    const data = useLoaderData();

    if (navigation.state === 'loading')
        return (
            <div className="w-full max-w-[1700px] flex justify-center">
                <Spinner/>
            </div>
        );

    return (
        <TrackCuesContextProvider>
            <DetailPage data={data}/>
        </TrackCuesContextProvider>
    );
};

function DetailPage({data}) {
    const [session, setSession] = useState(getHashData().s);
    const [captions, setCaptions] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [tabOpened, setTabOpened] = useState('transcription');
    const [setChapterCues, setCaptionCues, setCurrentTime] = useTrackCues();

    useEffect(_ => {
        function jumpToSession() {
            const hashData = getHashData();
            setSession(hashData.s);
        }

        window.addEventListener('hashchange', jumpToSession);

        return _ => {
            window.removeEventListener('hashchange', jumpToSession);
        };
    });

    return (
        <div className="flex flex-col md:flex-row w-full max-w-[1700px] mx-auto gap-10 xl:gap-20 px-6">
            <div className="w-full flex-col md:flex-row gap-10 xl:gap-20 flex">
                <VideoColumn data={data} session={session} chapters={chapters}
                             setTabOpened={setTabOpened} onTimeUpdate={setCurrentTime}
                             onCaptionsLoaded={setCaptions} onChaptersLoaded={setChapters}/>
                <TabsColumn data={data} chapters={chapters} captions={captions}
                            tabOpened={tabOpened} setTabOpened={setTabOpened}/>
            </div>
        </div>
    );
}

function VideoColumn({data, session, chapters, setTabOpened, onTimeUpdate, onCaptionsLoaded, onChaptersLoaded}) {
    const navigate = useNavigate();
    const sessionData = data.interviewsessies.find(s => parseInt(s.Volgorde) === session);

    function backToSearch() {
        const code = sessionStorage.getItem('lastSearchCode');
        navigate(`/zoeken${code ? '/' + code : ''}`);
    }

    return (
        <div className="md:w-1/2">
            <div>
                <button
                    className="rounded bg-white border border-diploblue-700 py-1 px-2 text-sm -mt-4 mb-2 flex flex-row items-center justify-start"
                    onClick={backToSearch}>
                    <ArrowLeftIcon className="w-4 h-4 fill-diploblue-700 mr-1"/>
                    Terug naar zoeken
                </button>
            </div>

            <Video id={data.id} session={session} onTimeUpdate={onTimeUpdate}
                   onCaptionsLoaded={onCaptionsLoaded} onChaptersLoaded={onChaptersLoaded}/>

            <div className="mt-4 mb-2 lg:mt-10 lg:mb-2 flex flex-col md:flex-row w-full justify-between">
                <h1>
                    Interview met {data.naam_volledig}
                </h1>

                <div className="flex flex-col items-end">
                    <div>
                        {getNLDate(sessionData.Opnamedatum)}
                    </div>

                    <div>
                        <button
                            className="rounded bg-white border border-diploblue-700 py-1 px-2 text-sm flex flex-row items-center mt-2 justify-start"
                            onClick={_ => setTabOpened('interviews')}>
                            Bekijk alle interviews
                        </button>
                    </div>
                </div>
            </div>

            <Chapters cues={chapters}/>
        </div>
    );
}

function TabsColumn({data, chapters, captions, tabOpened, setTabOpened}) {
    return (
        <div className="w-full max-w-lg md:w-1/2">
            <div className="flex flex-row w-full border-b border-blueGrey-100 mb-4 lg:mb-8">
                <TabButton title="CV" id="person" tabOpened={tabOpened} setTabOpened={setTabOpened}/>

                {data.bibliografie.length > 0 &&
                    <TabButton title="Publicaties" id="publications"
                               tabOpened={tabOpened} setTabOpened={setTabOpened}/>}

                <TabButton title="Overzicht" id="interviews" tabOpened={tabOpened} setTabOpened={setTabOpened}/>
                <TabButton title="Transcript" id="transcription" tabOpened={tabOpened} setTabOpened={setTabOpened}/>
            </div>

            {tabOpened === 'person' &&
                <Stationeringen stationeringen={data.stationeringen}/>}

            {tabOpened === 'publications' &&
                <Bibliografie bibliografie={data.bibliografie}/>}

            {tabOpened === 'interviews' &&
                <Interviews interviews={data.interviewsessies}/>}

            {tabOpened === 'transcription' &&
                <Transcription chapters={chapters} captions={captions}/>}
        </div>
    );
}

function TabButton({title, id, tabOpened, setTabOpened}) {
    return (
        <button
            className={`${tabOpened === id ? 'bg-blueGrey-100 font-semibold' : ''} py-2 px-3 rounded-t border border-blueGrey-100 border-b-0 hover:bg-blueGrey-200`}
            onClick={_ => setTabOpened(id)}>
            {title}
        </button>
    );
}
