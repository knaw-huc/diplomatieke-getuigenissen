import {useNavigation, useLoaderData, Link} from "react-router-dom";
import {getNLDate} from "../misc/utils.js";
import {Spinner} from "../misc/loading.jsx";
import {getApiBase} from "../misc/config.js";

export async function diplomatenLoader() {
    return fetch(`${getApiBase()}/diplomaten`);
}

export default function Diplomaten() {
    const navigation = useNavigation();
    if (navigation.state === 'loading')
        return (
            <div className="w-full max-w-[1700px] flex justify-center">
                <Spinner/>
            </div>
        );

    const data = useLoaderData();
    const filtered = data.filter(d => d.achternaam.length > 0);

    const alphabet = filtered.map(d => d.achternaam[0].toUpperCase()).filter((v, i, a) => a.indexOf(v) === i);
    const perLetter = filtered.reduce((acc, d) => {
        const letter = d.achternaam[0].toUpperCase();
        if (!(letter in acc))
            acc[letter] = [];
        acc[letter].push(d);
        return acc;
    }, {});

    return (
        <div className="w-full max-w-[1700px] mx-auto px-6">
            <p>Hier vind je een overzicht van alle geïnterviewde diplomaten.</p>

            <div className="sticky top-0 bg-white py-4 scroll-mt-36">
                {alphabet.map(letter =>
                    <a key={letter} href={`#${letter}`} className="text-diploblue-700 mr-3">{letter}</a>)}
            </div>

            {Object.entries(perLetter).map(([letter, diplomaten]) =>
                <DiplomatenLetterList key={letter} letter={letter} diplomaten={diplomaten}/>)}
        </div>
    );
};

function DiplomatenLetterList({letter, diplomaten}) {
    return (
        <div className="mb-6">
            <a id={letter}/>

            <h2 className="text-2xl w-full py-2 mb-4 border-b border-diploblue-700">
                {letter}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full max-w-[1700px] mx-auto gap-4">
                {diplomaten.map(d =>
                    <DiplomaatItem key={d.id} item={d}/>)}
            </div>
        </div>
    );
}

function DiplomaatItem({item}) {
    return (
        <div className="bg-diploblue-50 rounded">
            <div className="font-semibold text-xl p-4 border-b border-diploblue-100">
                {item.titel}
            </div>

            <div className="text-base p-4 border-b border-diploblue-100">
                {item.samenvatting}
            </div>

            <ol className="p-4 list-decimal ml-6">
                {item.opnames && Object.entries(item.opnames).map(([id, date]) => <li key={id}>
                    <Link to={`/interview/${item.id}#s=${id}`} className="text-diploblue-700 hover:underline">
                        Interview {getNLDate(date)}
                    </Link>
                </li>)}
            </ol>
        </div>
    );
}
