import React from 'react';
import AddPrezzoOrario from './AddPrezzoOrario';

const InsertTariffa = ({
                           nome,
                           setNome,
                           prezziOrari,
                           handlePrezzoOrarioChange,
                           handleAddPrezzoOrario,
                           handleAddTariffa
                       }) => {
    return (
        <>
            <label>
                Nome:
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
                <hr/>
            </label>
            {prezziOrari.map((_, index) => (
                <AddPrezzoOrario
                    key={index}
                    index={index}
                    prezziOrari={prezziOrari}
                    handlePrezzoOrarioChange={handlePrezzoOrarioChange}
                />
            ))}
            <div className="tooltip">
                <button className="add-prezzo-orario" onClick={handleAddPrezzoOrario}>+</button>
                <span className="tooltiptext">Aggiungi fascia oraria</span>
            </div>
            <br/>
            <div className="conferma-tariffa">
                <button onClick={handleAddTariffa}>Aggiungi Tariffa</button>
            </div>
        </>
    )
        ;
};

export default InsertTariffa;
