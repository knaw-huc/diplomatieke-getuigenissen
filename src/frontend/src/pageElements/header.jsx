import logo from '../assets/img/logo-huygens-instituut.png';
import {SearchIcon} from "../misc/icons.jsx";

export default function Header() {
    return (
        <header className="border-b border-diploblue-600 text-diploblue-700">
            <div className="px-6 w-full max-w-[1700px] mx-auto flex flex-col lg:flex-row items-center justify-between">
                <div className="mt-4 mb-2 lg:mt-0 flex flex-row items-center justify-start">
                    <a href="/index.html" className="text-diploblue-800">
                        <span className="font-semibold">Diplomatieke Getuigenissen</span>
                    </a>
                </div>

                <div className="flex flex-col md:flex-row  gap-8">
                    <nav className="flex flex-row flex-wrap justify-center items-center text-sm md:text-base">
                        <a href="/wordpress.html"
                           className="text-diploblue-800 py-1 lg:py-6 px-2 border-b-4 border-white hover:border-diploblue-700 hover:bg-diploblue-50">
                            Home
                        </a>

                        <a href="/zoeken"
                           className="text-diploblue-800 py-1 lg:py-6 px-2 border-b-4 border-white hover:border-diploblue-700 hover:bg-diploblue-50 flex items-center gap-1">
                            <SearchIcon className="w-4 h-4 fill-diploblue-800"/>
                            Zoeken in collectie
                        </a>

                        <a href="/diplomaten"
                           className="text-diploblue-800 py-1 lg:py-6 px-2 border-b-4 border-white hover:border-diploblue-700 hover:bg-diploblue-50">
                            Interviews
                        </a>

                        <a href="/wordpress2.html"
                           className="text-diploblue-800 py-1 lg:py-6 px-2 border-b-4 border-white hover:border-diploblue-700 hover:bg-diploblue-50">
                            Over dit project
                        </a>
                    </nav>

                    <div className="flex-row items-center hidden lg:flex">
                        <div>
                            <img src={logo} alt="" className="h-6 sm:h-8 md:-mt-2"/>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
};
