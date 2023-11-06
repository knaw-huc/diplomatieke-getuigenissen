import {useState} from "react";
import {useNavigate, useNavigation, useLoaderData, Link} from "react-router-dom";
import {Base64} from "js-base64";
import FreeTextFacet from "../facets/freeTextFacet.jsx";
import ListFacet from "../facets/listFacet.jsx";
import ResultCard from "./resultcard.jsx";
import Video from "./video.jsx";
import Transcription from "./transcript.jsx";
import {getHash, getTimeHash} from "../misc/utils.js";
import {getApiBase} from "../misc/config.js";
import {Spinner} from "../misc/loading.jsx";
import {CrossIcon, InformationIcon, PersonIcon, LocationIcon, OrganisationIcon, SearchIcon} from "../misc/icons.jsx";
import useTrackCues, {TrackCuesContextProvider} from "../hooks/useTrackCues.jsx";

export async function searchLoader({params}) {
    let searchStruc = {
        searchvalues: [],
        page: 1,
        page_length: 10
    };

    if (params.code) {
        sessionStorage.setItem('lastSearchCode', params.code);
        const parameters = JSON.parse(Base64.decode(params.code));
        searchStruc = {
            searchvalues: parameters.searchvalues,
            page: parameters.page,
            page_length: 10
        };
    }

    const result = await fetch(`${getApiBase()}/browse`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchStruc)
    });

    return {searchStruc, result: await result.json()};
}

export default function Search() {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const {searchStruc, result} = useLoaderData();

    const [selectedId, setSelectedId] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);

    function onSelectedItem(id, session, time) {
        setSelectedId(id);
        setSelectedSession(session || 1);
        window.location.hash = getTimeHash(time);
    }

    function doSearch(searchStruc) {
        navigate('/zoeken/' + Base64.encode(JSON.stringify(searchStruc)));
        window.scroll(0, 0);
    }

    function removeFacet(field, value) {
        if (typeof searchStruc.searchvalues === 'object') {
            searchStruc.searchvalues.forEach((item) => {
                if (item.name === field) {
                    item.values = item.values.filter(element => element !== value);
                }
            })
            searchStruc.searchvalues = searchStruc.searchvalues.filter(el => el.values.length > 0);
            if (searchStruc.searchvalues.length === 0) {
                searchStruc.searchvalues = [];
            }
        }

        doSearch({...searchStruc, page: 1});
    }

    function selectPage(page) {
        doSearch({...searchStruc, page});
    }

    const sendCandidate = (candidate) => {
        if (searchStruc.searchvalues.length === 0) {
            searchStruc.searchvalues = [{
                name: candidate.facet,
                field: candidate.field,
                values: [candidate.candidate]
            }];
        }
        else {
            if (typeof searchStruc.searchvalues === 'object') {
                let found = false;
                searchStruc.searchvalues.forEach((item) => {
                    if (item.name === candidate.facet) {
                        found = true;
                        if (!item.values.includes(candidate.candidate)) {
                            item.values.push(candidate.candidate);
                        }
                    }
                });
                if (!found) {
                    searchStruc.searchvalues.push({
                        name: candidate.facet,
                        field: candidate.field,
                        values: [candidate.candidate]
                    });
                }
            }
        }

        doSearch({...searchStruc, page: 1});
    }

    return (
        <div className="flex flex-col md:flex-row w-full max-w-[1700px] mx-auto gap-10 xl:gap-20 px-6">
            <SearchFilters sendCandidate={sendCandidate} searchValues={searchStruc.searchvalues}/>

            {navigation.state === 'loading' ? (
                <div className="w-full max-w-[600px] flex justify-center">
                    <Spinner/>
                </div>
            ) : (
                <SearchResults searchStruc={searchStruc} result={result}
                               onFilterRemove={removeFacet} selectPage={selectPage} onItem={onSelectedItem}/>
            )}

            {selectedId && <DetailView id={selectedId} session={selectedSession}/>}
        </div>
    );
};

function SearchFilters({sendCandidate, searchValues}) {
    return (
        <div className="w-full hidden md:flex flex-col max-w-[300px] bg-white">
            <FreeTextFacet add={sendCandidate}/>
            <ListFacet parentCallback={sendCandidate} searchValues={searchValues}
                       name="naam" field="titel"/>
            <ListFacet parentCallback={sendCandidate} searchValues={searchValues}
                       name="land" field="land"/>
            <ListFacet parentCallback={sendCandidate} searchValues={searchValues}
                       name="organisatie" field="organisatie"/>
        </div>
    );
}

function SearchResults({searchStruc, result, onFilterRemove, selectPage, onItem}) {
    return (
        <div className="w-full max-w-[600px] flex flex-col">
            {searchStruc.searchvalues?.length > 0 &&
                <div className="flex flex-col md:flex-row gap-2 justify-between mb-10">
                    <span className="font-semibold">
                        {result.amount} {result.amount > 9999 && '+'} interviews gevonden
                    </span>
                </div>
            }

            {searchStruc.searchvalues?.length > 0 &&
                <SelectedFilters searchValues={searchStruc.searchvalues} onRemove={onFilterRemove}/>}

            {!searchStruc.searchvalues || searchStruc.searchvalues.length === 0 &&
                <div className="w-full rounded border p-4 mb-6 border-blueGrey-200">
                    <InformationIcon className="w-7 h-7 stroke-diploBlue-500 mb-2"/>
                    Gebruik de zoektermen aan de linkerzijde om de resultaten te verfijnen.
                </div>}

            <ul>
                {result.items.map(item =>
                    <ResultCard key={item.id} item={item} searchValues={searchStruc.searchvalues} onItem={onItem}/>
                )}

                {result.amount > searchStruc.page_length &&
                    <Pagination page={searchStruc.page} pages={result.pages} selectPage={selectPage}/>}
            </ul>
        </div>
    );
}

function SelectedFilters({searchValues, onRemove}) {
    function getIcon(field) {
        switch (field) {
            case 'FREE_TEXT':
                return <SearchIcon className="w-4 h-4 fill-(lookup . 'twColor')-600"/>;
            case 'titel':
                return <PersonIcon className="w-4 h-4 fill-(lookup . 'twColor')-600"/>;
            case 'land':
                return <LocationIcon className="w-4 h-4 fill-(lookup . 'twColor')-600"/>;
            case 'organisatie':
                return <OrganisationIcon className="w-4 h-4 fill-(lookup . 'twColor')-600"/>;
        }
    }

    const selectedFilters = searchValues.reduce((acc, item) => acc.concat(item.values.map(value => ({
        value,
        name: item.name,
        className: item.field === 'FREE_TEXT'
            ? 'rounded bg-pink-100 text-pink-900 py-1 px-1 text-sm flex flex-row'
            : 'rounded bg-greenGrey-100 text-greenGrey-900 py-1 px-1 text-sm flex flex-row',
        icon: getIcon(item.field),
        key: `${item.field}__${value}`
    }))), []);

    return (
        <div className="flex flex-row gap-2 my-4 flex-wrap">
            {selectedFilters.map(item => (
                <SelectedFilter key={item.key} value={item.value} name={item.name}
                                className={item.className} icon={item.icon} onRemove={onRemove}/>
            ))}
        </div>
    );
}

function SelectedFilter({value, name, className, icon, onRemove}) {
    return (
        <button className={className} onClick={_ => onRemove(name, value)}>
            <span className="mr-1">
                {icon}
            </span>

            <span>{value}</span>

            <span className="ml-1">
                <CrossIcon className="w-5 h-5 fill-(lookup . 'twColor')-800"/>
            </span>
        </button>
    );
}

function Pagination({page, pages, selectPage}) {
    const minPage = page - 4 > 0 ? 4 : page - 1;
    const prevPages = Array.from({length: minPage}, (x, i) => page - minPage + i);

    const maxPage = page + 4 < pages ? 4 : pages - page;
    const nextPages = Array.from({length: maxPage}, (x, i) => page + 1 + i);

    return (
        <nav aria-label="Pagination" className="my-6">
            <ul className="list-style-none flex gap-1">
                {page > 1 && <PageBtn title="Vorige" onClick={_ => selectPage(page - 1)}/>}

                {prevPages.map(prevPage =>
                    <PageBtn key={prevPage} title={prevPage} onClick={_ => selectPage(prevPage)}/>)}

                <PageBtn title={page}/>

                {nextPages.map(nextPage =>
                    <PageBtn key={nextPage} title={nextPage} onClick={_ => selectPage(nextPage)}/>)}

                {page < pages && <PageBtn title="Volgende" onClick={_ => selectPage(page + 1)}/>}
            </ul>
        </nav>
    );
}

function PageBtn({title, onClick}) {
    return (
        <li aria-current={!onClick ? 'page' : undefined}>
            <a className={onClick
                ? 'relative block rounded bg-transparent px-3 py-1.5 text-diploblue-800 transition-all duration-300 hover:bg-blueGrey-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white cursor-pointer'
                : 'relative block rounded bg-blueGrey-100 px-3 py-1.5 font-medium text-diploblue-800 transition-all duration-300'}
               onClick={onClick}>
                {title}
            </a>
        </li>
    );
}

function DetailView({id, session}) {
    return (
        <TrackCuesContextProvider>
            <MiniPlayer id={id} session={session}/>
        </TrackCuesContextProvider>
    );
}

function MiniPlayer({id, session}) {
    const [captions, setCaptions] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [setChapterCues, setCaptionCues, setCurrentTime] = useTrackCues();

    return (
        <div className="w-full flex-col flex">
            <div className="max-h-screen sticky top-0 overflow-y-auto">
                <Video id={id} session={session} onTimeUpdate={setCurrentTime}
                       onCaptionsLoaded={setCaptions} onChaptersLoaded={setChapters}/>

                <div className="m-1">
                    <div className="w-full text-right my-4">
                        <Link to={`/interview/${id}${getHash(undefined, session)}`}
                              className="rounded bg-white border border-diploblue-700 py-1 px-2 text-sm">
                            Uitgebreide weergave
                        </Link>
                    </div>

                    <Transcription chapters={chapters} captions={captions}/>
                </div>
            </div>
        </div>
    );
}