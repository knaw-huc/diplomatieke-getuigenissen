import {useState, useEffect} from "react";
import {getDuration, getNLDate} from "../misc/utils.js";
import {ArrowRightIcon, DoubleArrowDownIcon} from "../misc/icons.jsx";
import {GhostLines} from "../misc/loading.jsx";
import {getApiBase} from "../misc/config.js";

const LIMIT_SIZE = 3;

export default function ResultCard({item, searchValues, onItem}) {
    const [isLoading, setIsLoading] = useState(false);
    const [highlights, setHighlights] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const totalMatches = highlights.reduce((acc, session) => acc + session.matches.length, 0);

    const limitedHighlights = highlights.reduce((acc, session) => {
        const limit = LIMIT_SIZE - acc.count;
        if (limit > 0) {
            acc.count += session.matches.length > limit ? limit : session.matches.length;
            acc.highlights.push({
                ...session,
                matches: session.matches.length > limit ? session.matches.slice(0, limit) : session.matches
            });
        }
        return acc;
    }, {count: 0, highlights: []}).highlights;

    const keywordSearch = searchValues.reduce((acc, item) => {
        if (item.field === 'FREE_TEXT')
            acc.push(...item.values);
        return acc;
    }, []);

    useEffect(_ => {
        if (keywordSearch.length === 0) return;

        const fetchHighlights = async () => {
            setIsLoading(true);

            const result = await fetch(`${getApiBase()}/transcript`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    record: item.id,
                    searchvalues: keywordSearch
                })
            });

            const highlights = await result.json();

            setIsLoading(false);
            setHighlights(highlights);
        };

        fetchHighlights();
    }, keywordSearch);

    return (
        <li className="w-full rounded border cursor-pointer mb-6 divide-y divide-solid bg-blueGrey-50 hover:bg-white border-blueGrey-50 hover:border-blueGrey-200 transition">
            <div className="font-semibold p-4" onClick={_ => onItem(item.id)}>
                {item.titel}
            </div>

            {keywordSearch.length > 0 && <>
                {isLoading ? <div className="p-4">
                    <GhostLines/>
                </div> : <>
                    {(totalMatches > LIMIT_SIZE && !showAll ? limitedHighlights : highlights).map(session =>
                        <SessionResults key={session.session} id={item.id} session={session} onItem={onItem}/>)}

                    {totalMatches > LIMIT_SIZE && !showAll &&
                        <div className="flex flex-row items-center justify-end"
                             onClick={_ => setShowAll(true)}>
                            <div className="text-sm italic text-blueGrey-600 p-2 w-full text-right">
                                Bekijk alle {totalMatches} resultaten
                            </div>

                            <div>
                                <button className="p-3 rounded cursor-pointer">
                                    <DoubleArrowDownIcon className="w-4 h-4 fill-diploblue-900"/>
                                </button>
                            </div>
                        </div>}
                </>}
            </>}
        </li>
    );
}

function SessionResults({id, session, onItem}) {
    return (
        <div>
            <div className="text-sm italic text-blueGrey-600 p-2 w-full">
                Interview {getNLDate(session.date)}
            </div>

            {session.matches.map(match =>
                <SessionMatch key={match.start} id={id} session={session.session} match={match} onItem={onItem}/>)}
        </div>
    );
}

function SessionMatch({id, session, match, onItem}) {
    const text = [];

    let left = match.text;
    let isMatchPart = false;
    while (left.length > 0) {
        const idx = left.indexOf(!isMatchPart ? '{{{' : '}}}');
        text.push({isMatchPart, text: idx === -1 ? left : left.substring(0, idx)});
        left = idx === -1 ? '' : left.substring(idx + 3);
        isMatchPart = !isMatchPart;
    }

    return (
        <div className="flex flex-col sm:flex-row items-center text-sm gap-4 hover:bg-blueGrey-50 p-2"
             onClick={_ => onItem(id, session, match.start)}>
            <div className="timestamp font-mono text-xs mt-1 self-start">
                {getDuration(match.start)}
            </div>

            <div className="flex-grow mb-1">
                {text.map((part, i) => !part.isMatchPart
                    ? part.text
                    : <span key={`${part.text}_${i}`} className="p-1 rounded border-white border bg-pink-100">
                        {part.text}
                    </span>)}
            </div>

            <div>
                <button className="rounded cursor-pointer">
                    <ArrowRightIcon className="w-5 h-5 fill-diploblue-900"/>
                </button>
            </div>
        </div>
    );
}
