var Mezzo = /** @class */ (function () {
    function Mezzo(tipo, idUnivoco, stato) {
        this.tipo = tipo;
        this.idUnivoco = idUnivoco;
        this.stato = stato;
    }
    Mezzo.prototype.assegnaUtente = function (utente) {
        if (this.stato === 'disponibile') {
            this.stato = 'in uso';
        }
        else {
            console.log('Errore: Il mezzo non è disponibile.');
        }
    };
    return Mezzo;
}());
var Utente = /** @class */ (function () {
    function Utente(nome, cognome, email, metodoPagamentoPreferito) {
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.metodoPagamentoPreferito = metodoPagamentoPreferito;
    }
    Utente.prototype.prenotaMezzo = function (mezzo) {
        if (mezzo.stato === 'disponibile') {
            mezzo.assegnaUtente(this);
            console.log("Mezzo con ID ".concat(mezzo.idUnivoco, " prenotato da ").concat(this.nome, " ").concat(this.cognome, "."));
        }
        else {
            console.log('Errore: Mezzo non disponibile.');
        }
    };
    return Utente;
}());
var Citta = /** @class */ (function () {
    function Citta(nomeCitta) {
        this.mezziDisponibili = [];
        this.nomeCitta = nomeCitta;
    }
    Citta.prototype.aggiungiMezzo = function (mezzo) {
        // Controlla se esiste già un mezzo con lo stesso ID
        var mezzoEsistente = this.mezziDisponibili.some(function (m) { return m.idUnivoco === mezzo.idUnivoco; });
        if (mezzoEsistente) {
            console.log("Errore: Un mezzo con ID ".concat(mezzo.idUnivoco, " esiste gi\u00E0 a ").concat(this.nomeCitta, "."));
            return;
        }
        this.mezziDisponibili.push(mezzo);
        this.aggiornaListaDOM();
    };
    Citta.prototype.prenotaMezzo = function (idMezzo, utente) {
        var mezzoTrovato = false;
        for (var i = 0; i < this.mezziDisponibili.length; i++) {
            if (this.mezziDisponibili[i].idUnivoco === idMezzo) {
                utente.prenotaMezzo(this.mezziDisponibili[i]);
                mezzoTrovato = true;
                this.aggiornaListaDOM();
                break;
            }
        }
        if (!mezzoTrovato) {
            console.log("Errore: Nessun mezzo con ID ".concat(idMezzo, " trovato a ").concat(this.nomeCitta, "."));
        }
    };
    Citta.prototype.visualizzaMezziDisponibili = function () {
        this.aggiornaListaDOM();
    };
    Citta.prototype.aggiornaListaDOM = function () {
        var listaElement = document.getElementById("listaMezzi".concat(this.nomeCitta));
        console.log("Aggiornamento lista per ".concat(this.nomeCitta, ":"), this.mezziDisponibili);
        if (listaElement) {
            listaElement.innerHTML = ''; // Resetta la lista
            this.mezziDisponibili.forEach(function (mezzo) {
                var listItem = document.createElement('li');
                listItem.textContent = "ID: ".concat(mezzo.idUnivoco, ", Tipo: ").concat(mezzo.tipo, ", Stato: ").concat(mezzo.stato);
                listaElement.appendChild(listItem);
            });
        }
        else {
            console.log("Elemento con ID listaMezzi".concat(this.nomeCitta, " non trovato."));
        }
    };
    return Citta;
}());
document.addEventListener('DOMContentLoaded', function () {
    var milano = new Citta("Milano");
    var roma = new Citta("Roma");
    // Aggiunta dei mezzi
    var mezzo1 = new Mezzo("bici", "B001", "in uso");
    var mezzo2 = new Mezzo("scooter", "S001", "disponibile");
    var mezzo3 = new Mezzo("monopattino elettrico", "M002", "disponibile");
    var mezzo4 = new Mezzo("bici", "B002", "in uso");
    milano.aggiungiMezzo(mezzo1);
    roma.aggiungiMezzo(mezzo2);
    milano.aggiungiMezzo(mezzo3);
    roma.aggiungiMezzo(mezzo4);
    function mostraPopup(messaggio) {
        var messaggioElement = document.getElementById('messaggioConferma');
        var popUpElement = document.getElementById('popUp');
        if (messaggioElement && popUpElement) {
            messaggioElement.textContent = messaggio;
            popUpElement.style.display = 'block';
        }
        else {
            console.error("Errore: Elementi per il pop-up non trovati.");
        }
    }
    function aggiungiMezzo(citta, tipo, id, stato) {
        var mezzoEsistente = citta.mezziDisponibili.some(function (m) { return m.idUnivoco === id; });
        if (mezzoEsistente) {
            mostraPopup("Errore: Un mezzo con ID ".concat(id, " esiste gi\u00E0 a ").concat(citta.nomeCitta, "."));
            return;
        }
        var nuovoMezzo = new Mezzo(tipo, id, stato);
        citta.aggiungiMezzo(nuovoMezzo);
        aggiornaVisualizzazioneMezzi(citta);
    }
    function prenotaMezzo(citta, idMezzo, utente) {
        var mezzoTrovato = false;
        for (var i = 0; i < citta.mezziDisponibili.length; i++) {
            var mezzo = citta.mezziDisponibili[i];
            if (mezzo.idUnivoco === idMezzo) {
                mezzoTrovato = true;
                if (mezzo.stato === 'in uso') {
                    mostraPopup("Errore: Mezzo con ID ".concat(idMezzo, " \u00E8 gi\u00E0 in uso. Scegliere un altro mezzo."));
                }
                else {
                    utente.prenotaMezzo(mezzo);
                    aggiornaVisualizzazioneMezzi(citta);
                    mostraPopup("Mezzo con ID ".concat(idMezzo, " prenotato da ").concat(utente.nome, " ").concat(utente.cognome, "."));
                }
                break;
            }
        }
        if (!mezzoTrovato) {
            mostraPopup("Errore: Nessun mezzo con ID ".concat(idMezzo, " trovato a ").concat(citta.nomeCitta, "."));
        }
    }
    function aggiornaVisualizzazioneMezzi(citta) {
        var listaElement = document.getElementById("listaMezzi".concat(citta.nomeCitta));
        if (!listaElement) {
            console.error("Elemento con ID listaMezzi".concat(citta.nomeCitta, " non trovato."));
            return;
        }
        listaElement.innerHTML = ''; // Resetta la lista
        citta.mezziDisponibili.forEach(function (mezzo) {
            var listItem = document.createElement('li');
            listItem.textContent = "ID: ".concat(mezzo.idUnivoco, ", Tipo: ").concat(mezzo.tipo, ", Stato: ").concat(mezzo.stato);
            listaElement.appendChild(listItem);
        });
    }
    function gestisciSelezioneCitta() {
        var cittaSelezionata = document.getElementById('selezionaCitta').value;
        if (cittaSelezionata === "milano") {
            document.getElementById('sezioneMilano').style.display = 'block';
            document.getElementById('sezioneRoma').style.display = 'none';
            aggiornaVisualizzazioneMezzi(milano);
        }
        else if (cittaSelezionata === "roma") {
            document.getElementById('sezioneMilano').style.display = 'none';
            document.getElementById('sezioneRoma').style.display = 'block';
            aggiornaVisualizzazioneMezzi(roma);
        }
    }
    // Inizializza la visualizzazione di default
    document.getElementById('sezioneMilano').style.display = 'block';
    document.getElementById('sezioneRoma').style.display = 'none';
    aggiornaVisualizzazioneMezzi(milano);
    document.getElementById('selezionaCitta').addEventListener('change', gestisciSelezioneCitta);
    document.getElementById('aggiungiButton').addEventListener('click', function () {
        var tipoMezzo = document.getElementById('tipoMezzo').value;
        var idMezzo = document.getElementById('idMezzo').value;
        var statoMezzo = document.getElementById('statoMezzo').value;
        var cittaSelezionata = document.getElementById('selezionaCitta').value;
        if (!idMezzo) {
            mostraPopup("Errore: L'ID del mezzo non può essere vuoto.");
            return;
        }
        if (cittaSelezionata === "milano") {
            aggiungiMezzo(milano, tipoMezzo, idMezzo, statoMezzo);
        }
        else if (cittaSelezionata === "roma") {
            aggiungiMezzo(roma, tipoMezzo, idMezzo, statoMezzo);
        }
    });
    document.getElementById('prenotaButton').addEventListener('click', function () {
        var nomeUtente = document.getElementById('nomeUtente').value;
        var cognomeUtente = document.getElementById('cognomeUtente').value;
        var emailUtente = document.getElementById('emailUtente').value;
        var idMezzo = document.getElementById('idMezzoPrenota').value;
        var cittaSelezionata = document.getElementById('selezionaCitta').value;
        var utente = new Utente(nomeUtente, cognomeUtente, emailUtente, 'carta di credito');
        if (cittaSelezionata === "milano") {
            prenotaMezzo(milano, idMezzo, utente);
        }
        else if (cittaSelezionata === "roma") {
            prenotaMezzo(roma, idMezzo, utente);
        }
    });
    document.getElementById('chiudiPopUp').addEventListener('click', function () {
        document.getElementById('popUp').style.display = 'none';
    });
});
