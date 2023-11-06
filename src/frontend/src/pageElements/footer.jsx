export default function Footer() {
    return (
        <footer className="bg-diploblue-700 text-white mt-6">
            <div className="py-12 px-6 w-full max-w-[1700px] mx-auto flex flex-col md:flex-row justify-center gap-12">
                <div className="w-full border-t border-diploblue-600 pt-4">
                    <nav className="flex flex-col">
                        <a href="/wordpress.html" className="text-white">
                            Home
                        </a>

                        <a href="/zoeken" className="text-white">
                            Getuigenissen
                        </a>

                        <a href="/wordpress2.html" className="text-white">
                            Over dit project
                        </a>
                    </nav>
                </div>

                <div className="w-full border-t border-diploblue-600 pt-4">
                    <p className="max-w-sm">
                        <strong>Diplomatieke Getuigenissen</strong> is een project van het <a
                        className="text-white underline" href="https://huygens.knaw.nl/">Huygens Instituut</a>
                    </p>
                </div>

                <div className="w-full border-t border-diploblue-600 pt-4">
                    <p className="max-w-sm">
                        Door diplomatieke getuigenissen te filmen en ze doorzoekbaar te maken,
                        kunnen we een schat aan informatie verzamelen over verschillende diplomatieke
                        periodes, belangrijke gebeurtenissen en bilaterale betrekkingen.
                    </p>
                </div>
            </div>
        </footer>
    )
};
