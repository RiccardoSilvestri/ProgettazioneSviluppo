import React from 'react';
import {Outlet, Link} from "react-router-dom";

export default function Panel() {
    return (
        <>
            <ul className="router-link">
                <li>
                    <Link to={`parcheggi`}>Parcheggi</Link>
                </li>
                <li>
                    <Link to={`tariffe`}>Tariffe</Link>
                </li>
                <li>
                    <Link to={`gestione-aree`}>Gestione Aree</Link>
                </li>
            </ul>
            <div id="detail">
                <Outlet/>
            </div>
        </>
    );
}
