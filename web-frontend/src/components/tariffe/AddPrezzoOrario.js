import React from 'react';

const AddPrezzoOrario = ({index, prezziOrari, handlePrezzoOrarioChange}) => {
    return (
        <div className="prezzo-orario">
            <p style={{fontWeight: "bold"}}>Fascia Oraria {index+1}</p>
            <label>
                Prezzo (€):
                <input
                    type="number"
                    step=".01"
                    min="0"
                    value={prezziOrari[index].prezzo}
                    onChange={(e) => handlePrezzoOrarioChange(index, "prezzo", Number(e.target.value))}
                />
            </label>
            <label>
                Da (minuti):
                <input
                    type="number"
                    min="0"
                    value={prezziOrari[index].da}
                    onChange={(e) => handlePrezzoOrarioChange(index, "da", Number(e.target.value))}
                />
                A (minuti):
                <input
                    type="number"
                    min={prezziOrari[index].da}
                    value={prezziOrari[index].a}
                    onChange={(e) => handlePrezzoOrarioChange(index, "a", Number(e.target.value))}
                />
            </label>
        </div>
    );
};

export default AddPrezzoOrario;
