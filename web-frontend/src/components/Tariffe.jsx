import React, {useState} from 'react';
import "../styles/tariffe.css";
import "../styles/tooltip.css";
import InsertTariffa from './tariffe/InsertTariffa';

const Tariffe = ({listaTariffe, setListaTariffe}) => {
    const [nome, setNome] = useState("");
    const [prezziOrari, setPrezziOrari] = useState([{prezzo: 0, da: 0, a: 0, frazione: 5}]);

    const handleAddTariffa = () => {
        if (nome.trim() === "") {
            alert("Inserisci il nome");
        } else if (nome.length > 25) {
            alert("Il nome non puo' superare i 25 caratteri");
        } else {
            const newTariffa = {
                nome: nome,
                prezzo_orario: prezziOrari,
            };
            setListaTariffe([...listaTariffe, newTariffa]);
            setNome("");
            setPrezziOrari([{prezzo: 0, da: 0, a: 0, frazione: 5}]);
        }
    };

    const handleDeleteTariffa = (index) => {
        const newListaTariffe = listaTariffe.filter((_, i) => i !== index);
        setListaTariffe(newListaTariffe);
    };

    const handleAddPrezzoOrario = () => {
        setPrezziOrari([...prezziOrari, {prezzo: 0, da: 0, a: 0, frazione: 5}]);
    };

    const handlePrezzoOrarioChange = (index, key, value) => {
        const newPrezziOrari = prezziOrari.map((item, i) => (
            i === index ? {...item, [key]: value} : item
        ));
        setPrezziOrari(newPrezziOrari);
    };

    return (
        <>
            <div className="lista-tariffe">
                <InsertTariffa
                    nome={nome}
                    setNome={setNome}
                    prezziOrari={prezziOrari}
                    handlePrezzoOrarioChange={handlePrezzoOrarioChange}
                    handleAddPrezzoOrario={handleAddPrezzoOrario}
                    handleAddTariffa={handleAddTariffa}
                />
            </div>
            <div className="lista-tariffe">
                <ul>
                    {listaTariffe?.map((tariffa, index) => (
                        <li key={index}>
                            <p>{tariffa.nome}</p>
                            {tariffa.prezzo_orario.map((item, index) => (
                                <ul className="prezzo-orario" key={index}>
                                    <li>
                                        <p>da <code>{item.da}</code> a <code>{item.a}</code>: {item.prezzo}€</p>
                                        <div className="tooltip">
                                            <code>{item.frazione}"</code>
                                            <span className="tooltiptext">Il pagamento del parcheggio avanzerà ogni {item.frazione} minuti</span>
                                        </div>
                                    </li>
                                </ul>
                            ))}
                            <button onClick={() => handleDeleteTariffa(index)} className="delete-button">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Tariffe;
