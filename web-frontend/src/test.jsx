import React, { useEffect, useRef, useState } from "react";
import { FeatureGroup, Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";
import { drawAreas, getPolygonCentroid } from "./utils/utils";
import { useLayerContext } from "./hooks/layers.hook";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import {createAreaParcheggio} from "./utils/dataAccess";

// Questo blocco di codice risolve un problema con le icone quando si utilizza webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png"
});

// Questa funzione restituisce un oggetto GeoJSON vuoto
function getGeoJson() {
    return {
        type: "FeatureCollection",
        features: [
            // ... (feature GeoJSON esistenti)
        ]
    };
}

const Test = () => {
    const {
        layersArray,
        addLayerToArray,
        flyToCordsArray,
        setLayersArray,
        deletedLayers,
        setDeletedLayers,
        comuneCords,
        initialCoords,
        setLeafletElement,
    } = useLayerContext();
    // Questo stato viene utilizzato per memorizzare il riferimento al FeatureGroup modificabile
    const [editableFG, setEditableFG] = useState(null);

    useEffect(() => {
        if (flyToCordsArray) {
            const { current = {} } = mapRef;
            const { leafletElement } = current;
            setLeafletElement(leafletElement);
            leafletElement.flyTo(flyToCordsArray, 17, {
                duration: 0.6
            })
        }
    }, [flyToCordsArray]);


    useEffect(() => {
        let geojson = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": []
                }
            }]
        };
        const { current = {} } = mapRef;
        const { leafletElement } = current;
        setLeafletElement(leafletElement);
        initialCoords?.forEach(a => {
            geojson.features[0].geometry.coordinates = [[...a.coordinates]];
            a.leaflet_id = drawAreas(geojson, leafletElement)
        })
        setLayersArray([...initialCoords]);

    }, [initialCoords]);


    useEffect(() => {   
        const { current } = mapRef;
        const { leafletElement } = current;
    
        // Configura il provider di ricerca
        const provider = new OpenStreetMapProvider();
        // Crea e aggiungi il controllo di ricerca alla mappa
        const searchControl = new GeoSearchControl({
            provider: provider,
            style: 'bar',
            autoComplete: true,
            autoCompleteDelay: 250,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: true,
            showMarker: false,
            searchLabel: 'Cerca un luogo',
        });
    
        leafletElement.addControl(searchControl);
        return () => {
            // Rimuovi il controllo di ricerca dalla mappa quando il componente viene smontato
            leafletElement.removeControl(searchControl);
        };
    }, []);
    

    const mapRef = useRef();


    // Questa funzione viene chiamata quando viene creata una nuova forma
    const onCreated = (e) => {
        const layer = e.layer
        const layerName = window.prompt("Inserisci un nome per il nuovo layer:");

        if (layerName) {
            const layerCordsArr = layer.toGeoJSON().geometry.coordinates;
            const newLayer = {
                name: layerName,
                leaflet_id: layer._leaflet_id,
                coordinates: layerCordsArr[0],
                tariffa: "",
                numPosti: 0,
            };
            addLayerToArray(newLayer);

            createAreaParcheggio(layerName,newLayer)
            console.log("_onCreated: nuovo layer aggiunto", layer);
            setTimeout(() => {  window.location.reload();  }, 10)
        }else{
            e.layer.remove()
        }
    };

    useEffect(() => {
        const { current } = mapRef;
        const { leafletElement } = current;
    
        const handleZoomEnd = () => {
            const zoomLevel = leafletElement.getZoom();
            //console.log("Zoom level:", zoomLevel);

            const fontSize = zoomLevel / 1.5; //da trovare una dimensione decente
            const layerElements = document.querySelectorAll('.layerName');
            layerElements.forEach(element => {
            element.style.fontSize = `${fontSize}px`;
            if(zoomLevel>13){
                element.style.display = 'block';//dovrebbe essere al contrario, da capire
            }
            else{
                element.style.display = 'none'; //dovrebbe essere al contrario, da capire
            }
            }

    );
    
            for (let i = 0; i < layersArray.length; i++) {
                //console.log(layersArray[i].name);
            }
        };
    
        leafletElement.on('zoomend', handleZoomEnd);
    
        return () => {
            leafletElement.off('zoomend', handleZoomEnd);
        };
    }, [layersArray]);
    

    // Questa funzione viene chiamata quando una forma esistente viene modificata
    const onEdited = (e) => {
        let numEdited = 0;
        e.layers.eachLayer(layer => {
            numEdited += 1;
        });
        const changedAreasIds = [...Object.keys(e.layers._layers)];
        const changedAreas = [];
        changedAreasIds.forEach((i) => {
            changedAreas.push({
                leaflet_id: i,
                coordinates: e.layers._layers[i].toGeoJSON().geometry.coordinates[0],
            });
        });
        setLayersArray(prevLayersArray => {
            changedAreas.forEach(ca => {
                prevLayersArray.forEach(prev => {
                    if (ca.leaflet_id == prev.leaflet_id)
                        prev.coordinates = [...ca.coordinates];
                })
            })
            return [...prevLayersArray];
        })
        console.log(`_onEdited: modificati ${numEdited} layer`, e);
    };

    // Questa funzione viene chiamata quando una forma esistente viene eliminata
    const onDeleted = (e) => {
        let numDeleted = 0;
        e.layers.eachLayer(layer => {
            numDeleted += 1;
        });

        const layersToDelete = e.layers.toGeoJSON().features;
        const layersCoordinates = layersToDelete.map((ltd) => ltd.geometry.coordinates[0]);

        setDeletedLayers(prevDeletedLayers => [...prevDeletedLayers, ...layersToDelete]);
        setLayersArray(prevLayersArray => {
            const updatedLayersArray = prevLayersArray.filter(existingLayer =>
                !layersCoordinates.some(matchArray => {
                    // debug
                    console.log("matchArray: ", matchArray)
                    console.log("existingLayer: ", existingLayer.coordinates);
                    console.log("outcome: ", existingLayer.coordinates.every((value, index) => value === matchArray[index]));
                    if (matchArray.length === existingLayer.coordinates.length) {
                        for (let i = 0; i < matchArray.length; i++) {
                            return matchArray[i][0] === existingLayer.coordinates[i][0] && matchArray[i][1] === existingLayer.coordinates[i][1];
                        }
                    } else {
                        return false;
                    }
                }
                )
            );
            console.log("Updated Layers Array after deletion:", updatedLayersArray);
            return updatedLayersArray;
        });
        console.log(`_onDeleted: rimossi ${numDeleted} layer`, e);
    };

    // Questa funzione viene chiamata quando il controllo di modifica viene montato
    const onMounted = (drawControl) => {
        console.log("_onMounted", drawControl);
    };

    // Questa funzione viene chiamata quando inizia la modifica di una geometria
    const onEditStart = (e) => {
        console.log("_onEditStart", e);
    };

    // Questa funzione viene chiamata quando termina la modifica di una geometria
    const onEditStop = (e) => {
        console.log("_onEditStop", e);
    };

    // Questa funzione viene chiamata quando inizia l'eliminazione di una geometria
    const onDeleteStart = (e) => {
        console.log("_onDeleteStart", e);
    };

    // Questa funzione viene chiamata quando termina l'eliminazione di una geometria
    const onDeleteStop = (e) => {
        console.log("_onDeleteStop", e);
    };

    // Questa funzione viene chiamata quando cambia lo stato del FeatureGroup modificabile
    const onChangeInternal = () => {
        if (!editableFG) {
            return;
        }

        const geojsonData = editableFG.leafletElement.toGeoJSON();
    };

    // Questa funzione viene chiamata quando il FeatureGroup è pronto
    const onFeatureGroupReady = (reactFGref) => {
        if (!reactFGref) {
            return;
        }

        let leafletGeoJSON = new L.GeoJSON(getGeoJson());
        let leafletFG = reactFGref.leafletElement;

        leafletGeoJSON.eachLayer(layer => {
            leafletFG.addLayer(layer);
        });

        setEditableFG(reactFGref);
    };

    // Questo Effect viene eseguito quando cambia lo stato del FeatureGroup modificabile
    useEffect(() => {
        onChangeInternal();
    }, [editableFG]);

    return (
        <Map ref={mapRef} center={comuneCords} zoom={15} zoomControl={false} maxZoom={19}>
            <TileLayer
                attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            <FeatureGroup ref={onFeatureGroupReady}>
                <EditControl
                    position="topright"
                    onEdited={onEdited}
                    onCreated={onCreated}
                    onDeleted={onDeleted}
                    onMounted={onMounted}
                    onEditStart={onEditStart}
                    onEditStop={onEditStop}
                    onDeleteStart={onDeleteStart}
                    onDeleteStop={onDeleteStop}
                    draw={{
                        rectangle: false,
                        polyline: false,
                        circlemarker: false,
                        circle: false,
                        marker: false,
                        edit: false,
                    }}
                    edit={{
                        edit: false,
                        remove: false,
                    }}
                />
            </FeatureGroup>
            {layersArray.map(({ coordinates, name }, id) => {
                // funzione per creare un marker al cenrtro di ogni area di parcheggio
                const [x, y] = getPolygonCentroid(coordinates)
                const inverted = [y, x]
                const divIcon = L.divIcon({
                    className: "my-div-icon",
                    html: `<div class="layerName">${name}</div>`
                });
                // bisogna invertire le coordinate perche' react leaflet le prende cosi (y - x)
                return (
                    <Marker position={inverted} key={id} icon={divIcon}>
                        <Popup>
                            {name}
                        </Popup>
                    </Marker>
                )
            })}
        </Map>
    );
};

export default Test;
