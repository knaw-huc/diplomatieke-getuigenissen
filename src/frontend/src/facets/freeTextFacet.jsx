import {useState, useEffect} from "react";
import {SearchIcon} from "../misc/icons.jsx";

export default function FreeTextFacet(props) {
    const [textField, setTextField] = useState("");
    const [refresh, setRefresh] = useState(true);

    function handleChange(e) {
        setTextField(e.currentTarget.value);
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            setTextFacet();
        }
    }

    function setTextFacet() {
        if (textField !== "") {
            props.add({facet: "Free text", field: "FREE_TEXT", candidate: textField});
            setRefresh(!refresh);
        }
    }

    useEffect(() => {
        setTextField("");
    }, [refresh]);

    return (
        <div className="mb-6">
            <label htmlFor="text-search" className="font-semibold">Zoek op tekst</label>

            <div className="flex flex-row w-full">
                <input className="py-1 px-3 w-full rounded-l border border-diploblue-700" type="search"
                       id="text-search" name="q" value={textField} onChange={handleChange} onKeyUp={handleKeyPress}/>
                <button type="button" onClick={_ => {setTextFacet()}}
                        className="bg-diploblue-700 py-1 px-3 rounded-r border-t border-b border-r border-diploblue-700"
                        aria-label="Zoeken">
                    <SearchIcon className="w-4 h-4 fill-white"/>
                </button>
            </div>
        </div>
    )
};
