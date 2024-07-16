import React, { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { useLayerContext } from "../hooks/layers.hook";
import { removeAreaParcheggio } from "../utils/dataAccess";
import { getSensoriLiberi } from "../utils/dataAccess";
import { assegnaSensore } from "../utils/dataAccess";
import "../styles/gestione-aree.css";

// Componente che gestisce l'elenco delle aree e permette di visualizzare dettagli specifici su richiesta.
const GestioneAree = ({ layers, setLayers, listaTariffe }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [numPosti, setNumPosti] = useState(0);
    const [tariffa, setTariffa] = useState('');
    const { leafletElement } = useLayerContext();
    const [sensoriLiberi, setSensoriLiberi] = useState([]);

    useEffect(() => {
        (async () => {
            setSensoriLiberi([... await getSensoriLiberi()]);
        })();
    }, []);

    const handleClick = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const findLeafletLayer = (id) => {
        let layer;
        leafletElement.eachLayer(l => {
            if (l._leaflet_id === id) {
                layer = l;
            }
        });
        if (layer) {
            return layer;
        }
        return null;
    }

    const DisplayLayers = () => (
        <ul>
            {layers.map((item, index) => (
                <li key={index}>
                    <div onClick={() => handleClick(index)}
                        style={{ cursor: 'pointer', width: "100%", fontWeight: "bold" }}>
                        {item.name}
                    </div>
                    {expandedIndex === index && (
                        <div className="dettagli-area">
                            Tariffa:
                            <select value={tariffa || ''} onChange={(e) => {
                                setTariffa(e.target.value);
                            }}>
                                {listaTariffe?.map((tariffa, index) => (
                                    <option value={tariffa.nome} key={index}>{tariffa.nome}</option>
                                ))}
                            </select>
                            <p><strong>Sensori</strong></p>
                            <div className="sensCont">
                                {sensoriLiberi.map((s) => {
                                    const { id } = s;
                                    return (
                                        <button key={id} className="singleSens" onClick={() => {
                                            assegnaSensore(item.id, id);
                                            setSensoriLiberi(prev => prev.filter(p => p.id !== id))
                                        }}
                                        >
                                            {id}
                                        </button>
                                    );
                                })}
                            </div>
                            <Button onClick={() => {
                                if (confirm("Sicuro di voler eliminare la zona?")) {
                                    const l = findLeafletLayer(item.leaflet_id);
                                    removeAreaParcheggio(item.id);
                                    l?.remove();
                                    setLayers(v => v.filter(i => i.leaflet_id !== item.leaflet_id));
                                }
                            }} className="delete-button">Elimina</Button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="lista-aree">
            <DisplayLayers />
        </div>
    )
}

export default GestioneAree;
