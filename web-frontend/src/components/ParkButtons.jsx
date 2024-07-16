import React, { useEffect, useState } from "react";
import { getPolygonCentroid } from "../utils/utils";
import { getPostiArea } from "../utils/dataAccess";
import "../styles/parkButtons.css";

const ParkButtons = (layers) => {
  const [searchTerm, setSearchTerm] = useState(""); //usestate per la ricerca
  const [filteredItems, setFilteredItems] = useState(layers.layer); //usestate per filtrare ricerca

  useEffect(() => {
    if (!searchTerm) {
      setFilteredItems(layers.layer); // Mostra tutti se il termine di ricerca è vuoto
      return;
    }
  
    const filtered = layers.layer.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) // ignora le maiuscole e minuscole
    );
    setFilteredItems(filtered); //cambia lo usestate del filtro
  }, [searchTerm, layers.layer]);

  const Test = ({ item }) => { 
    const [x, setX] = useState(null);
    useEffect(() => {
      const fetchData = async () => {
        const data = await getPostiArea(item.id);
        setX(data);
      };
      fetchData();
    }, [item.id]);

    return (
      <div className="singleParking" key={item.id}>
                <div className="dets">
                    <button
                        key={item.id}
                        onClick={() => {
                            const [y, x] = getPolygonCentroid(item.coordinates);
                            layers.setFlyToCordsArray([x, y]);
                        }}  
                        style={{backgroundColor: ( 
                            (x?.occupati / x?.totali) * 100) <= 80 ? 
                            ( (x?.occupati / x?.totali) * 100) <= 40 ? 
                                '#64d096' : '#ffaf00' : '#f5443d'}}
                    >
                        <p>{item.name}</p>
                    </button>
                    <p>
                        {x?.occupati ?? "..."} posti occupati su {x?.totali ?? "..."} [
                        {isNaN( Math.trunc( ( x?.occupati / x?.totali ) * 100 ) ) ? 
                            "Nessun sensore assegnato" :  
                            Math.trunc( ( x?.occupati / x?.totali ) * 100 ) + "%"  }
                        ]
                    </p>
                </div>
                <div className="progressBar">
                    <div className="filler" style={{width: Math.trunc( ( x?.occupati / x?.totali ) * 100 ) + '%'}}>
                    </div>
                </div>
      </div>
    );
  };

  return (
    <>
      <input
      className="barraDiRicerca"
        type="text"
        placeholder="Cerca l'area..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
        <br />
      <div className="btnContainer">
        {filteredItems.map((item) => (
          <Test key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default ParkButtons;
