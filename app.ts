interface IMezzo {
    tipo: 'bici' | 'scooter' | 'monopattino elettrico';
    idUnivoco: string;
    stato: 'disponibile' | 'in uso';
    assegnaUtente(utente: IUtente): void;
}

interface IUtente {
    nome: string;
    cognome: string;
    email: string;
    metodoPagamentoPreferito: 'carta di credito' | 'PayPal' | 'bonifico bancario';
    prenotaMezzo(mezzo: IMezzo): void;
}

interface ICitta {
    nomeCitta: string;
    mezziDisponibili: IMezzo[];
    aggiungiMezzo(mezzo: IMezzo): void;
    prenotaMezzo(idMezzo: string, utente: IUtente): void;
    visualizzaMezziDisponibili(): void;
}

class Mezzo implements IMezzo {
    tipo: 'bici' | 'scooter' | 'monopattino elettrico';
    idUnivoco: string;
    stato: 'disponibile' | 'in uso';

    constructor(tipo: 'bici' | 'scooter' | 'monopattino elettrico', idUnivoco: string, stato: 'disponibile' | 'in uso') {
        this.tipo = tipo;
        this.idUnivoco = idUnivoco;
        this.stato = stato;
    }

    assegnaUtente(utente: IUtente): void {
        if (this.stato === 'disponibile') {
            this.stato = 'in uso';
        } else {
            console.log('Errore: Il mezzo non è disponibile.');
        }
    }
}

class Utente implements IUtente {
    nome: string;
    cognome: string;
    email: string;
    metodoPagamentoPreferito: 'carta di credito' | 'PayPal' | 'bonifico bancario';

    constructor(nome: string, cognome: string, email: string, metodoPagamentoPreferito: 'carta di credito' | 'PayPal' | 'bonifico bancario') {
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.metodoPagamentoPreferito = metodoPagamentoPreferito;
    }

    prenotaMezzo(mezzo: IMezzo): void {
        if (mezzo.stato === 'disponibile') {
            mezzo.assegnaUtente(this);
            console.log(`Mezzo con ID ${mezzo.idUnivoco} prenotato da ${this.nome} ${this.cognome}.`);
        } else {
            console.log('Errore: Mezzo non disponibile.');
        }
    }
}

class Citta implements ICitta {
    nomeCitta: string;
    mezziDisponibili: IMezzo[] = [];

    constructor(nomeCitta: string) {
        this.nomeCitta = nomeCitta;
    }

    aggiungiMezzo(mezzo: IMezzo): void {
        // Controlla se esiste già un mezzo con lo stesso ID
        const mezzoEsistente = this.mezziDisponibili.some(m => m.idUnivoco === mezzo.idUnivoco);
        if (mezzoEsistente) {
            console.log(`Errore: Un mezzo con ID ${mezzo.idUnivoco} esiste già a ${this.nomeCitta}.`);
            return;
        }
        this.mezziDisponibili.push(mezzo);
        this.aggiornaListaDOM();
    }


    prenotaMezzo(idMezzo: string, utente: IUtente): void {
        let mezzoTrovato = false;

        for (let i = 0; i < this.mezziDisponibili.length; i++) {
            if (this.mezziDisponibili[i].idUnivoco === idMezzo) {
                utente.prenotaMezzo(this.mezziDisponibili[i]);
                mezzoTrovato = true;
                this.aggiornaListaDOM();
                break;
            }
        }

        if (!mezzoTrovato) {
            console.log(`Errore: Nessun mezzo con ID ${idMezzo} trovato a ${this.nomeCitta}.`);
        }
    }

    visualizzaMezziDisponibili(): void {
        this.aggiornaListaDOM();
    }

    private aggiornaListaDOM(): void {
        const listaElement = document.getElementById(`listaMezzi${this.nomeCitta}`);
        console.log(`Aggiornamento lista per ${this.nomeCitta}:`, this.mezziDisponibili);
        if (listaElement) {
            listaElement.innerHTML = ''; // Resetta la lista
            this.mezziDisponibili.forEach(mezzo => {
                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${mezzo.idUnivoco}, Tipo: ${mezzo.tipo}, Stato: ${mezzo.stato}`;
                listaElement.appendChild(listItem);
            });
        } else {
            console.log(`Elemento con ID listaMezzi${this.nomeCitta} non trovato.`);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const sezioneMilano = document.getElementById('sezioneMilano');
    if (sezioneMilano) {
        // Ora puoi accedere a sezioneMilano.style senza preoccuparti di null
        sezioneMilano.style.backgroundColor = 'none';
    } else {
        console.error('Elemento con ID "sezioneMilano" non trovato.');
    }

    const milano = new Citta("Milano");
    const roma = new Citta("Roma");

    // Aggiunta dei mezzi
    const mezzo1 = new Mezzo("bici", "B001", "in uso");
    const mezzo2 = new Mezzo("scooter", "S001", "disponibile");
    const mezzo3 = new Mezzo("monopattino elettrico", "M002", "disponibile");
    const mezzo4 = new Mezzo("bici", "B002", "in uso");

    milano.aggiungiMezzo(mezzo1);
    roma.aggiungiMezzo(mezzo2);
    milano.aggiungiMezzo(mezzo3);
    roma.aggiungiMezzo(mezzo4);

    function mostraPopup(messaggio: string) {
        const messaggioElement = document.getElementById('messaggioConferma');
        const popUpElement = document.getElementById('popUp');
        
        if (messaggioElement && popUpElement) {
            messaggioElement.textContent = messaggio;
            popUpElement.style.display = 'block';
        } else {
            console.error("Errore: Elementi per il pop-up non trovati.");
        }
    }
      

    function aggiungiMezzo(citta: Citta, tipo: string, id: string, stato: 'disponibile' | 'in uso') {
        const mezzoEsistente = citta.mezziDisponibili.some(m => m.idUnivoco === id);
        if (mezzoEsistente) {
            mostraPopup(`Errore: Un mezzo con ID ${id} esiste già a ${citta.nomeCitta}.`);
            return;
        }
        const nuovoMezzo = new Mezzo(tipo as 'bici' | 'scooter' | 'monopattino elettrico', id, stato);
        citta.aggiungiMezzo(nuovoMezzo);
        aggiornaVisualizzazioneMezzi(citta);
    }    

    function prenotaMezzo(citta: Citta, idMezzo: string, utente: IUtente) {
        let mezzoTrovato = false;

        for (let i = 0; i < citta.mezziDisponibili.length; i++) {
            const mezzo = citta.mezziDisponibili[i];
            if (mezzo.idUnivoco === idMezzo) {
                mezzoTrovato = true;
                
                if (mezzo.stato === 'in uso') {
                    mostraPopup(`Errore: Mezzo con ID ${idMezzo} è già in uso. Scegliere un altro mezzo.`);
                } else {
                    utente.prenotaMezzo(mezzo);
                    aggiornaVisualizzazioneMezzi(citta);
                    mostraPopup(`Mezzo con ID ${idMezzo} prenotato da ${utente.nome} ${utente.cognome}.`);
                }
                break;
            }
        }

        if (!mezzoTrovato) {
            mostraPopup(`Errore: Nessun mezzo con ID ${idMezzo} trovato a ${citta.nomeCitta}.`);
        }
    }



    function aggiornaVisualizzazioneMezzi(citta: Citta) {
        const listaElement = document.getElementById(`listaMezzi${citta.nomeCitta}`)!;
        if (!listaElement) {
            console.error(`Elemento con ID listaMezzi${citta.nomeCitta} non trovato.`);
            return;
        }
        listaElement.innerHTML = ''; // Resetta la lista
        citta.mezziDisponibili.forEach(mezzo => {
            const listItem = document.createElement('li');
            listItem.textContent = `ID: ${mezzo.idUnivoco}, Tipo: ${mezzo.tipo}, Stato: ${mezzo.stato}`;
            listaElement.appendChild(listItem);
        });
    }

    function gestisciSelezioneCitta() {
        const cittaSelezionata = (document.getElementById('selezionaCitta') as HTMLSelectElement).value;

        if (cittaSelezionata === "milano") {
            document.getElementById('sezioneMilano')!.style.display = 'block';
            document.getElementById('sezioneRoma')!.style.display = 'none';
            aggiornaVisualizzazioneMezzi(milano);
        } else if (cittaSelezionata === "roma") {
            document.getElementById('sezioneMilano')!.style.display = 'none';
            document.getElementById('sezioneRoma')!.style.display = 'block';
            aggiornaVisualizzazioneMezzi(roma);
        }
    }

      // Inizializza la visualizzazione di default
      document.getElementById('sezioneMilano')!.style.display = 'block';
      document.getElementById('sezioneRoma')!.style.display = 'none';
      aggiornaVisualizzazioneMezzi(milano);

    document.getElementById('selezionaCitta')!.addEventListener('change', gestisciSelezioneCitta);

document.getElementById('aggiungiButton')!.addEventListener('click', () => {
    const tipoMezzo = (document.getElementById('tipoMezzo') as HTMLSelectElement).value;
    const idMezzo = (document.getElementById('idMezzo') as HTMLInputElement).value;
    const statoMezzo = (document.getElementById('statoMezzo') as HTMLSelectElement).value;
    const cittaSelezionata = (document.getElementById('selezionaCitta') as HTMLSelectElement).value;

    if (!idMezzo) {
        mostraPopup("Errore: L'ID del mezzo non può essere vuoto.");
        return;
    }

    if (cittaSelezionata === "milano") {
        aggiungiMezzo(milano, tipoMezzo, idMezzo, statoMezzo as 'disponibile' | 'in uso');
    } else if (cittaSelezionata === "roma") {
        aggiungiMezzo(roma, tipoMezzo, idMezzo, statoMezzo as 'disponibile' | 'in uso');
    }
});

document.getElementById('prenotaButton')!.addEventListener('click', () => {
    const nomeUtente = (document.getElementById('nomeUtente') as HTMLInputElement).value;
    const cognomeUtente = (document.getElementById('cognomeUtente') as HTMLInputElement).value;
    const emailUtente = (document.getElementById('emailUtente') as HTMLInputElement).value;
    const idMezzo = (document.getElementById('idMezzoPrenota') as HTMLInputElement).value;
    const cittaSelezionata = (document.getElementById('selezionaCitta') as HTMLSelectElement).value;

    const utente = new Utente(nomeUtente, cognomeUtente, emailUtente, 'carta di credito');

    if (cittaSelezionata === "milano") {
        prenotaMezzo(milano, idMezzo, utente);
    } else if (cittaSelezionata === "roma") {
        prenotaMezzo(roma, idMezzo, utente);
    }
});

document.getElementById('chiudiPopUp')!.addEventListener('click', () => {
    document.getElementById('popUp')!.style.display = 'none';
});
});