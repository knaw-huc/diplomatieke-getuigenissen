import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {getDuration, getHash, getNLDate} from "../misc/utils.js";
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
        <li className="w-full rounded border cursor-pointer mb-6 divide-y divide-solid bg-blueGrey-50 hover:bg-white border-blueGrey-50 hover:border-blueGrey-200 transition"
            aria-label="Zoekresultaat">
                
            <button className="font-semibold p-4" onClick={_ => onItem(item.id, item.record)}>
                {item.titel}
            </button>

            {keywordSearch.length > 0 && <>
                {isLoading ? <div className="p-4">
                    <GhostLines/>
                </div> : <>
                    {(totalMatches > LIMIT_SIZE && !showAll ? limitedHighlights : highlights).map(session =>
                        <SessionResults key={session.session} id={item.id} session={session}
                                        record={item.record} label={item.titel} onItem={onItem}/>)}

                    {totalMatches > LIMIT_SIZE && !showAll &&
                        <button className="flex flex-row items-center justify-end w-full"
                             onClick={_ => setShowAll(true)}>
                            <div className="text-sm italic text-blueGrey-600 p-2 w-full text-right">
                                Bekijk alle {totalMatches} resultaten
                            </div>

                            <div>
                                <div className="p-3 rounded cursor-pointer">
                                    <DoubleArrowDownIcon className="w-4 h-4 fill-diploblue-900"/>
                                </div>
                            </div>
                        </button>}
                </>}
            </>}
        </li>
    );
}

function SessionResults({id, session, record, label, onItem}) {
    return (
        <div>
            <div className="text-sm italic text-blueGrey-600 p-2 w-full">
                Interview {getNLDate(session.date)}
            </div>

            {session.matches.map(match =>
                <SessionMatch key={match.start} id={id} session={session.session}
                              record={record} label={label} match={match} onItem={onItem}/>)}
        </div>
    );
}

function SessionMatch({id, session, record, label, match, onItem}) {
    const navigate = useNavigate();
    const text = [];

    function onResultClick(e) {
        e.preventDefault();
        Array.from(e.currentTarget.querySelectorAll('.resultBtn'))
            .find(btn => btn.getBoundingClientRect().width > 0)
            .click();
    }

    let left = match.text;
    let isMatchPart = false;
    while (left.length > 0) {
        const idx = left.indexOf(!isMatchPart ? '{{{' : '}}}');
        text.push({isMatchPart, text: idx === -1 ? left : left.substring(0, idx)});
        left = idx === -1 ? '' : left.substring(idx + 3);
        isMatchPart = !isMatchPart;
    }

    return (
        <button className="flex flex-col sm:flex-row text-sm gap-4 hover:bg-blueGrey-50 p-2 w-full text-left" onClick={onResultClick}>
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

            

            <div className="resultBtn block md:hidden"
                 onClick={_ => navigate(`/interview/${id}${getHash(undefined, session)}`)} aria-label={`Bekijk dit fragment van ${label}`}>
                <div className="p-3 rounded cursor-pointer" >
                    <ArrowRightIcon className="w-5 h-5 fill-diploblue-900"/>
                </div>
            </div>

            <div className="resultBtn hidden md:block"
                 onClick={_ => onItem(id, record, session, match.start)}>
                <div className="p-3 rounded cursor-pointer" >
                    <ArrowRightIcon className="w-5 h-5 fill-diploblue-900"/>
                </div>
            </div>
        </button>
        
    );
}
