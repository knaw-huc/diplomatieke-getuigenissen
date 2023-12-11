import {Outlet, ScrollRestoration, useRouteError} from "react-router-dom";

import Header from "./pageElements/header.jsx";
import Footer from "./pageElements/footer.jsx";

export default function App() {
    return (
        <>
            <div className="flex flex-col min-h-screen mx-auto">
                <Header/>
                <div className="mt-10 md:mt-20 grow">
                    <ScrollRestoration/>
                    <Outlet/>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export function Error() {
    const error = useRouteError();

    return (
        <>
            <div className="flex flex-col min-h-screen mx-auto">
                <Header/>
                <div className="mt-10 md:mt-20 grow">
                    <div className="w-full max-w-[1700px] mx-auto px-6">
                        <h1>Error</h1>
                        <p className="pt-4">
                            <i>{error.statusText || error.message}</i>
                        </p>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}
