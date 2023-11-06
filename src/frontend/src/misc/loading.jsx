export function Spinner() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"
             className="animate-spin fill-none stroke-diploblue-600 stroke-2 h-24 w-24">
            <circle cx="25" cy="25" r="12" strokeDasharray="20,5" strokeLinecap="round"/>
        </svg>
    );
}

export function GhostLines() {
    return (
        <div className="flex flex-col animate-pulse gap-3">
            <div className="w-2/5 bg-diploblue-800 rounded h-4"/>
            <div className="w-3/5 bg-diploblue-800 rounded h-3 opacity-80"/>
            <div className="w-4/5 bg-diploblue-800 rounded h-3 opacity-60"/>
            <div className="w-3/5 bg-diploblue-800 rounded h-3 opacity-40"/>
            <div className="w-4/5 bg-diploblue-800 rounded h-3 opacity-20"/>
            <div className="w-5/5 bg-diploblue-800 rounded h-3 opacity-20"/>
            <div className="w-2/5 bg-diploblue-800 rounded h-3 opacity-20"/>
        </div>
    );
}
