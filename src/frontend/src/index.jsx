import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import App, {Error} from './app.jsx';
import Search, {searchLoader} from "./components/search.jsx";
import Detail, {detailLoader} from "./components/detail.jsx";
import Diplomaten, {diplomatenLoader} from "./components/diplomaten.jsx";

import './index.css';

const router = createBrowserRouter([{
    path: '/',
    element: <App/>,
    errorElement: <Error/>,
    children: [{
        index: true,
        path: 'zoeken?/:code?',
        loader: searchLoader,
        element: <Search/>
    }, {
        path: 'interview/:id',
        loader: detailLoader,
        element: <Detail/>
    }, {
        path: 'diplomaten',
        loader: diplomatenLoader,
        element: <Diplomaten/>
    }]
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
