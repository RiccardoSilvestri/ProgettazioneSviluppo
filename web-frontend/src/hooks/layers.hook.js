import React, {createContext, useContext, useEffect, useState} from "react";
import {getComunePosition, getParkingAreas} from "../utils/dataAccess";

const useLayer = () => {
    const [layersArray, setLayersArray] = useState([]);
    const [flyToCordsArray, setFlyToCordsArray] = useState(null);
    const [deletedLayers, setDeletedLayers] = useState([]);
    const [comuneCords, setComuneCords] = useState([41.54100152, 12.29469176]);
    const [initialCoords, setInitialCoords] = useState([]);
    const [leafletElement, setLeafletElement] = useState(null);
    useEffect(() => {
        (async () => {
            setComuneCords(await getComunePosition());
            const parkingAreas = await getParkingAreas();
            setInitialCoords([...parkingAreas]);
        })()
    }, []);

    const addLayerToArray = (newLayers) => {
        setLayersArray((v) => [...v, newLayers])
    };

    return {
        layersArray,
        addLayerToArray,
        flyToCordsArray,
        setFlyToCordsArray,
        setLayersArray,
        deletedLayers,
        setDeletedLayers,
        comuneCords,
        initialCoords,
        leafletElement,
        setLeafletElement
    };
}

const LayerContext = createContext(null);
export const useLayerContext = () => useContext(LayerContext);

export const LayerContextProvider = ({children}) => {
    const value = useLayer();
    return <LayerContext.Provider value={value}>{children}</LayerContext.Provider>;
}
