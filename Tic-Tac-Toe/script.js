"use strict"
const LUNG  = 3 //lunghezza del lato del campo da gioco

/* costanti per colori */
const GRIGIO = "rgb(127, 127, 127)";
const BIANCO = "rgb(255, 255, 255)"; // #FFFFFF
const ROSSO = "rgb(255, 0, 0)";
const BLU = "rgb(0, 0, 255)";
const GIALLO = "rgb(255,255,0)";



var campo = new Array; //campo da gioco(in initMatrice() viene trasformato in una matrice)
var cntPlayer = 0; //contatore per tenere conto dei turno

function start(){
    initMatrice();  //il vettore campo diventa matrice e viene settato a 0
    stampaturno();  //viene stampato il turno del giocatore che deve giocare
    disegnaCampo(); //crea la tabella della stessa dimensione del campo e la riempie di bottoni
}

function initMatrice(){//il vettore campo diventa matrice e viene settato a 0
    for (let i = 0; i < LUNG; i++)
        campo[i] = new Array;
    for (let i = 0; i < LUNG; i++)
        for (let j = 0; j < LUNG; j++)
            campo[i][j] = 0;
}

//crea la tabella della stessa dimensione del campo e la riempie di bottoni
function disegnaCampo(){
    //accesso al componente <div> tramite id
    var refbody = document.getElementById("campo_gioco");
    //creazione tabella 
    var table = document.createElement("table");

    //creazione variabili riga, cella, bottone
    var cella, riga, btn;
    //impostazioni grafiche tabella
    table.style.margin = "20px auto";
    table.style.borderSpacing = "0";
    refbody.appendChild(table);
    

    //creazione contenuto tabella
    for (let i = 0; i < LUNG; i++){
        //creazione riga
        riga = document.createElement("tr");
        table.appendChild(riga);

        for (let j = 0; j < LUNG; j++){
            //creazione cella
            cella = document.createElement("td");
            cella.style.width = "18px";
            riga.appendChild(cella);

            //creazione bottone + impostazione grafiche dello stesso
            btn = document.createElement("input");
            btn.type = "button";
            btn.id = "btn_" + i + "_" + j; // btn_riga_colonna
            btn.style.width = "75px";
            btn.style.height = "75px";
            btn.style.backgroundColor = GRIGIO;
            btn.style.color = BIANCO;
            btn.value = " ";
            btn.style.fontSize = "40px";
            btn.setAttribute("onClick", "prenotaCella(this);");

            cella.appendChild(btn);

        }
    }
}

//prenota cella contrassegna la cella premuta dal giocatore e controlla se ha vinto
function prenotaCella(btn){
    //il vettore vect divide l'id del bottone in tre parti
    let vect = btn.id.split("_"); 
    //se il bottone non ha testo non e' ancora stato premuto
    if (campo[vect[1]][vect[2]] == 0){  
        
        //se il tasto lo ha premuto il player1 nella casella verra' scritta in blu "X" e le verra' assegnato valore 3, altrimenti il testo 
        //sara' "O" rosso e il valore 5
        if  (cntPlayer % 2 == 0){
            btn.style.backgroundColor = GIALLO;
            btn.style.color = BLU;
            btn.setAttribute("value", "X");     
            campo[vect[1]][vect[2]] = 3;      
        }else{
            btn.style.backgroundColor = GIALLO;
            btn.style.color = ROSSO;
            btn.setAttribute("value", "O");
            campo[vect[1]][vect[2]] = 5;
        }
        
        cntPlayer++;  //incremento del contatore per cambiare turno
    } //fine if

    stampaturno(); //stampa il numero del giocatore che deve giocare

    switch (controllaVittoria()){ //in base a cosa restituisce controllaVittoria() verranno prodotti diversi output
        case 0:
            break;
        case 1:
            interrompiParita("GIOCATORE 1 HA VINTO!");
            break;
        case 2:
            interrompiParita("GIOCATORE 2 HA VINTO!");
            break;
        case 3:
            interrompiParita("PAREGGIO!");
            break;
    }
    
}

function stampaturno(){ //stampa il numero del giocatore che deve giocare
    document.getElementById("turno").innerHTML = "Ora tocca al giocatore " + (cntPlayer%2+1);
}

function controllaVittoria(){
    //il programma restituisce 0 se la partita non e' finita, 1 se ha vinto il player1, 2 se ha vinto il player2 o 3 se e' un pareggio
    //la variabile mul tiene conto della moltiplicazione tra ogni valore di una riga o colonna o diagonale, se il valore e' uguale all'elevazione
    //al cubo di un determinato numero (3 o 5) uno dei due giocatori ha vinto
    var mul;    

    //se non e'ancora arrivato il 5 turno e' matematicamente impossibile che qualcuno abbia vinto quindi e' inutile controllare
    if (cntPlayer >= 5){
        //controlla righe
        for (let i = 0; i < LUNG; i++){
            mul = 1;
            for (let j = 0; j < LUNG; j++){
                mul = mul * campo[i][j];
            }
            //controllo vittoria
            if (mul == 27)
                return 1;
            else if (mul == 125)
                return 2;
        }
        //controlla colonne
        for (let i = 0; i < LUNG; i++){
            mul = 1;
            for(let j = 0; j < LUNG; j++){
                mul = mul * campo[j][i];
            }
            //controllo vittoria
            if (mul == 27)
                return 1;
            else if (mul == 125)
                return 2;
        }

        //controllo diagonali da dx a sx
        let j = 0;
        let i = 0;
        mul = 1;
        while(i < LUNG && j < LUNG){
            mul = mul * campo[i][j];
            i++;
            j++;
        }
        //controllo vittoria
        if (mul == 27)
            return 1;
        else if (mul == 125)
            return 2;

        //controllo diagonali da sx a dx
        j = LUNG-1;
        i = 0;
        mul = 1;
        while(i < LUNG && j >= 0){
            mul = mul * campo[i][j];
            i++;
            j--;
        }
        //controllo vittoria
        if (mul == 27)
            return 1;
        else if (mul == 125)
            return 2;
        
    }
    if (cntPlayer == 9) //controllo pareggio
        return 3;
    return 0;
}

//se la partita si conclude viene stampato a schermo il messaggio di vittoria e il campo viene resettato a 0 per poter rigiocare
function interrompiParita(winner){ 
    for (let i = 0; i < LUNG; i++){
        for (let j = 0; j < LUNG; j++){
            document.getElementById("btn_" + i + "_" + j).style.backgroundColor = GRIGIO;
            document.getElementById("btn_" + i + "_" + j).value = " ";
            campo[i][j] = 0;
        }
    }
    cntPlayer = 0;
    document.getElementById("turno").innerHTML = winner;
}
