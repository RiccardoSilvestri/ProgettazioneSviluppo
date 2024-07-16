import React from "react";
import {useState, useEffect} from "react";
import Test from "./test";
import Panel from "./components/Panel";
import "./styles/index.css";
import {useLayerContext} from "./hooks/layers.hook";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet
} from "react-router-dom";
import Tariffe from "./components/Tariffe";
import ParkButtons from "./components/ParkButtons";
import GestioneAree from "./components/GestioneAree";
import {getTariffe} from "./utils/dataAccess";

const App = () => {

    const {layersArray, setLayersArray, setFlyToCordsArray} = useLayerContext();

    const [listaTariffe, setListaTariffe] = useState(null);

    useEffect(() => {
        (async () => setListaTariffe(await getTariffe()))()
    }, []);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Panel/>,
            children: [
                {
                    path: "/tariffe",
                    element: <Tariffe listaTariffe={listaTariffe} setListaTariffe={setListaTariffe}/>,
                },
                {
                    path: "/parcheggi",
                    element: <ParkButtons layer={layersArray} setFlyToCordsArray={setFlyToCordsArray}/>,
                },
                {
                    path: "/gestione-aree",
                    element: <GestioneAree layers={layersArray} setLayers={setLayersArray} listaTariffe={listaTariffe}/>,
                }
            ],
        },
    ]);

    return (
        <main>
            <div className="ContenitoreMappa">
                <div id="map-wrapper">
                    <Test/>
                </div>
            </div>
            <div className="panel">
                <RouterProvider router={router}/>
                <Outlet/>
            </div>
        </main>
    );
}

export default App;
