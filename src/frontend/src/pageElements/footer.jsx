export default function Footer() {
    return (
        <footer className="bg-diploblue-700 text-white mt-6">
            <div className="py-12 px-6 w-full max-w-[1700px] mx-auto flex flex-col md:flex-row justify-center gap-12">
                <div className="w-full border-t border-diploblue-600 pt-4">
                    <nav className="flex flex-col">
                        <a href="https://diplomatieke-getuigenissen.huygens.knaw.nl/"
                           className="text-white hover:underline">
                            Home
                        </a>

                        <a href="/zoeken" className="text-white hover:underline">
                            Zoeken in collectie
                        </a>

                        <a href="/diplomaten" className="text-white hover:underline">
                            Interviews
                        </a>

                        <a href="https://diplomatieke-getuigenissen.huygens.knaw.nl/index.php/over-dit-project/"
                           className="text-white hover:underline">
                            Over dit project
                        </a>

                        <a href="https://diplomatieke-getuigenissen.huygens.knaw.nl/index.php/colofon/"
                           className="text-white hover:underline">
                            Colofon
                        </a>
                    </nav>
                </div>

                <div className="w-full border-t border-diploblue-600 pt-4">
                    <p className="max-w-sm">
                        Dit is een project van het <strong><a className="text-white underline" target="_blank"
                                                              href="https://huygens.knaw.nl/">
                        Huygens Instituut</a></strong>
                    </p>
                </div>

                <div className="w-full border-t border-diploblue-600 pt-4">
                    <p className="max-w-sm">
                        <strong>Diplomatieke Getuigenissen</strong> is een oral history project over
                        de geschiedenis van het Nederlands buitenlands beleid.
                    </p>
                </div>
            </div>
        </footer>
    )
};
