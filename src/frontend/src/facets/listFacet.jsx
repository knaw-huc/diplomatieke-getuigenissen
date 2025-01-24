import {useState, useEffect} from "react";
import {getApiBase} from "../misc/config.js";

export default function ListFacet({name, field, searchValues, parentCallback}) {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('');
    const [amount, setAmount] = useState(10);
    const [loading, setLoading] = useState(true);
    const [more, setMore] = useState(true);
    const [hidden, setHidden] = useState(false);

    async function fetchData() {
        setLoading(true);

        const response = await fetch(`${getApiBase()}/facet`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: field,
                amount: amount,
                filter: filter,
                searchvalues: searchValues
            })
        });
        const json = await response.json();

        setData(json);
        setLoading(false);
    }

    function handleChange(e) {
        setFilter(e.currentTarget.value);
    }

    function sendCandidate(value) {
        parentCallback({facet: name, field: field, candidate: value});
    }

    function changeListLength() {
        setMore(!more);
        setAmount(more ? 500 : 10);
    }

    useEffect(() => {
        fetchData();
    }, [field, amount, filter, searchValues]);

    return (
        <>
            <div className="hcFacetSubDivision mb-2 flex justify-between capitalize">
                <span>{name}</span>
                <button className="hcFacetGroup cursor-pointer text-sm" onClick={_ => setHidden(!hidden)} aria-label="Klap dit zoek facet open of dicht">
                    {hidden ? '▶' : '▼'} {' '}
                    
                </button>
            </div>

            {!hidden &&
                <div className="hcLayoutFacetsToggle">
                    <div className="hcFacet">
                        <div className="hcFacetFilter">
                            <input type="text" placeholder="Typ om te filteren" onChange={handleChange}/>
                        </div>

                        {!loading ? (<div className="hcFacetItems">
                            {data.map((item, index) => (
                                <button key={index} className="hcFacetItem cursor-pointer text-left"
                                     onClick={_ => sendCandidate(item.key)}>
                                    <div className="checkBoxItem">
                                        <span>{item.key}</span>
                                        <div className="facetAmount text-sm text-neutral-500">
                                            ({item.doc_count})
                                        </div>
                                    </div>
                                </button>
                            ))}

                            <button className="hcClickable cursor-pointer text-sm mt-2 text-left" 
                                onClick={changeListLength}
                                aria-label="Toon alle facetitems">
                                
                                {more ? 'Meer...' : 'Minder...'}
                            </button>
                        </div>) : (<div>Loading...</div>)}
                    </div>
                </div>
            }
        </>
    );
};
