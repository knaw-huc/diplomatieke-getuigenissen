import {BookmarkIcon} from "../misc/icons.jsx";
import {getHash, getNLDate, getSeconds} from "../misc/utils.js";

export default function Interviews({interviews}) {
    return (
        <div>
            {interviews.map(session => <div key={session.Volgorde}
                                            className="mb-8 pb-8 border-b border-diploblue-800">
                <h3 className="mb-2">
                    Interview {getNLDate(session.Opnamedatum)}
                </h3>

                <ul className="flex flex-col gap-1">
                    {session.Inhoud.map(item => <li key={`${session.Volgorde}_${item.tijdstip}`}
                                                    className="flex flex-row items-center justify-start">
                        <span className="mr-3">
                            <BookmarkIcon className="w-4 h-4 fill-diploBlue-700"/>
                        </span>

                        <a href={getHash(getSeconds(item.tijdstip), session.Volgorde)}
                           className="font-mono text-base mr-3">
                            {item.tijdstip}
                        </a>

                        {item.onderwerp}

                        {item.periodevan && !item.periodetot && ` (${item.periodevan})`}
                        {item.periodetot && !item.periodevan && ` (${item.periodetot})`}
                        {item.periodevan && item.periodetot && ` (${item.periodevan} - ${item.periodetot})`}
                    </li>)}
                </ul>

                <div className="mt-1 text-sm">
                    Duur: {session.Duur}
                </div>
            </div>)}
        </div>
    );
};
