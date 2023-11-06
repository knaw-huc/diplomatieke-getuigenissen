import DOMPurify from 'dompurify';
import {useEffect, useState} from "react";
import {GhostLines} from "../misc/loading.jsx";
import {getZoteroKey} from "../misc/config.js";

export default function Bibliografie({bibliografie}) {
    const [isLoading, setIsLoading] = useState(false);
    const [zoteroData, setZoteroData] = useState([]);

    useEffect(_ => {
        if (bibliografie.length === 0) return;

        const fetchFromZotero = async () => {
            setIsLoading(true);

            const zoteroData = await Promise.all(bibliografie.map(async item => {
                const response = await fetch(`${item.api}?${new URLSearchParams({
                    'format': 'bib',
                    'style': 'apa'
                })}`, {
                    method: 'GET',
                    headers: {
                        'Zotero-API-Key': getZoteroKey()
                    }
                });
                return response.text();
            }));

            setIsLoading(false);
            setZoteroData(zoteroData);
        };

        fetchFromZotero();
    }, bibliografie);

    return (
        <div>
            <h3 className="mb-4">Bibliografie</h3>

            {isLoading ? <div className="mt-2">
                <GhostLines/>
            </div> : <ul className="flex flex-col divide-y">
                {zoteroData.map((data, idx) =>
                    <li key={idx} className="py-3" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(data)}}/>)}
            </ul>}
        </div>
    );
}
