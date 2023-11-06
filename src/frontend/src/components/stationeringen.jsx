export default function Stationeringen({stationeringen}) {
    function getTextForType(item) {
        switch (item['Type']) {
            case 'departement':
                return `${item.Titel ? item.Titel + ',' : ''} ${item.Departement ? item.Departement + ',' : ''} ${item.Periode.Van}-${item.Periode.Tot}`;
            case 'post':
                return `${item.Titel ? item.Titel + ',' : ''} ${item.Post ? item.Post + ',' : ''} ${item.Periode.Van}-${item.Periode.Tot}`;
            case 'detachering':
                return `${item.Titel ? item.Titel + ',' : ''} ${item.Organisatie ? item.Organisatie + ',' : ''} ${item.Locatie ? item.Locatie + ',' : ''} ${item.Periode.Van}-${item.Periode.Tot}`;
            case 'buiten':
                return `${item.Titel ? item.Titel + ',' : ''} ${item.Organisatie ? item.Organisatie + ',' : ''} ${item.Locatie ? item.Locatie + ',' : ''} ${item.Periode.Van}-${item.Periode.Tot}`;
            default:
                return `${item.Titel ? item.Titel + ',' : ''} ${item.Organisatie ? item.Organisatie + ',' : ''} ${item.Locatie ? item.Locatie + ',' : ''} ${item.Periode.Van}-${item.Periode.Tot}`;
        }
    }

    return (
        <div>
            <h3 className="mb-4">Loopbaan</h3>

            <ul className="flex flex-col divide-y">
                {stationeringen.filter(item => item.Display !== 'no').map((item, idx) => <li key={idx} className="py-3">
                    {getTextForType(item)}
                </li>)}
            </ul>
        </div>
    );
};
