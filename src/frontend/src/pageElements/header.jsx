import {NavLink} from "react-router-dom";
import logo from '../assets/img/logo-huygens-instituut.png';

export default function Header() {
    return (
        <header className="border-b border-diploblue-600 text-diploblue-700">
            <div className="px-6 w-full max-w-[1700px] mx-auto flex flex-col lg:flex-row items-center justify-between">
                <div className="mt-4 md:mt-0 flex flex-row items-center justify-start">
                    <span className="font-semibold">
                        <a href="https://diplomatieke-getuigenissen.huygens.knaw.nl" className="text-diploblue-700">
                            Diplomatieke Getuigenissen
                        </a>
                    </span>
                </div>

                <div className="flex flex-col md:flex-row  gap-8">
                    <nav className="flex flex-row items-center text-sm md:text-base" aria-label="Hoofdnavigatie">
                        <a href="https://diplomatieke-getuigenissen.huygens.knaw.nl/"
                           className="text-diploblue-800 py-2 md:py-6 px-2 border-b-4 border-white hover:border-diploblue-700 hover:bg-diploblue-50">
                            Home
                        </a>

                        <NavLink to="/zoeken"
                                 className="text-diploblue-800 py-2 md:py-6 px-2 border-b-4 border-white hover:border-diploblue-700 hover:bg-diploblue-50">
                            Zoeken in collectie
                        </NavLink>

                        <NavLink to="/diplomaten"
                                 className="text-diploblue-800 py-2 md:py-6 px-2 border-b-4 border-white hover:border-diploblue-700 hover:bg-diploblue-50">
                            Interviews
                        </NavLink>

                        <a href="https://diplomatieke-getuigenissen.huygens.knaw.nl/index.php/over-dit-project/"
                           className="text-diploblue-800 py-2 md:py-6 px-2 border-b-4 border-white hover:border-diploblue-700 hover:bg-diploblue-50">
                            Over dit project
                        </a>

                        <a href="https://diplomatieke-getuigenissen.huygens.knaw.nl/index.php/colofon/"
                           className="text-diploblue-800 py-2 md:py-6 px-2 border-b-4 border-white hover:border-diploblue-700 hover:bg-diploblue-50">
                            Colofon
                        </a>
                    </nav>

                    <div className="flex-row items-center hidden lg:flex">
                        <div>
                            <a href="https://www.huygens.knaw.nl/" target="_blank"
                               aria-label="Dit is een project van het Huygens Instituut.">
                                <img src={logo} alt="" className="h-6 sm:h-8 md:-mt-2"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
};
