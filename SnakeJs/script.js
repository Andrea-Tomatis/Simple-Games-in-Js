"use strict"
const DIM = 20; // costante dimensione campo

var campo; // Vettore campo da gioco
var direzione = "dx"; // Direzione dello snake all'avvio

/* costanti per colori */
const GRIGIO = "rgb(127, 127, 127)";
const BIANCO = "rgb(255, 255, 255)"; // #FFFFFF
const ROSSO = "rgb(255, 0, 0)";
const BLU = "rgb(0, 0, 255)";

/* POSIZIONE SNAKE */
var posSn_x = 1; // coordinata x snake
var posSn_y = 1; // coordinata y snake
var coda = new Array(); // array contenente le posizioni dello snake
var cntCoda = 0;

/* PER MEMORIZZARE IL TIMEOUT */
var tOut; 

function avvia() {
    document.getElementById("rigioca").style.visibility = "hidden";
    initMatrice(); // inizializzare matrice di gioco 
    disegnaCampo(); // disegno grafica campo 

    coda.push(posSn_x + "," + posSn_y); // carico in coda posizione iniziale serpente

    // Generazione del cibo su coordinate random x, y 
    generaCibo();

    // Coloriamo la testa dello snake
    document.getElementById("btn_" + posSn_x + "_" + posSn_y).style.backgroundColor = BLU;
    muoviSnake();
}

function initMatrice() {
    campo = new Array(DIM); //campo adesso e' una array monodimensionale
    for (let i = 0; i < DIM; i++) { //campo diventa una matrice
        campo[i] = new Array(DIM);
    }
    //tutte le celle della matrice campo vengono azzerate
    for (let i = 0; i < DIM; i++) { 
        for (let j = 0; j < DIM; j++) {
            campo[i][j] = 0;
        }
    }
}



function disegnaCampo() { 
    var refBody = document.getElementById('campo_gioco'); //accedo al div campo_gioco tramite id
    //var refBody = document.getElementsByTagName("body")[0]; 
    var tabella = document.createElement("table");//creo la tabella
    refBody.appendChild(tabella); // in campo_gioco {div} => inserisco componente html table {tabella}
    //impostazioni grafiche della tabella
    tabella.style.margin = "20px auto"; 
    tabella.style.borderSpacing = "0";
    //creo tre variabili cella riga bottone da inserire nella tabella
    var cella, riga, btn;

    for (let i = 0; i < DIM; i++) {
        //aggiungi la riga alla tabella
        riga = document.createElement("tr"); 
        tabella.appendChild(riga);

        for (let j = 0; j < DIM; j++) {
            //matrice[i][j] = 0;
            // creazione cella
            cella = document.createElement("td");
            cella.style.width = "18px";
            riga.appendChild(cella);
            //creazione pulsante
            btn = document.createElement("input");
            btn.type = "button";
            btn.id = "btn_" + i + "_" + j; // btn_riga_colonna
            btn.style.width = "18px";
            btn.style.height = "15px";
            btn.style.backgroundColor = GRIGIO;
            btn.style.color = BIANCO;
            cella.appendChild(btn);
        }
    }
}



function generaCibo() {
    let xCibo, yCibo; 
    do{
        //il cibo viene generato randomicamente
        xCibo = Math.floor(DIM * Math.random()); 
        yCibo = Math.floor(DIM * Math.random());
    }while(xCibo == posSn_x && yCibo == posSn_y); //l'operazione viene ripetuta se il cibo si sovrappone al serpente
    

    let pulsante = document.getElementById("btn_" + xCibo + "_" + yCibo);

    pulsante.style.backgroundColor = ROSSO;
    campo[xCibo][yCibo] = 2; // matrice assegno valore 2 in posizione cibo 
    /*
     MATRICE CAMPO
     0 => cella vuota
     1 => snake
     2 => cibo
     */
}

function muoviSnake() {
    // 1. intercettare la direzione dx, sx, up, dw
    switch (direzione) {
        /*
         0 1 0 0 0 0 0 0 0 
         0 0 0 0 0 0 0 0 0  
         0 0 0 0 0 0 0 0 0
         0 0 0 0 0 0 0 0 0
         */
        case 'dx':
            posSn_y++;
            break;
        case 'sx':
            posSn_y--; 
            break;
        case 'up':
            posSn_x--;
            break;
        case 'dw':
            posSn_x++;
            break;
    }
    
    // 2. la coda viene fatta scorrere di 1 in modo da contenere la nuova posizione della testa del serpente e perdere l'ultima
    scorriCoda();
    // 3. resettare lo snake 
    resettaSnake();
    // 4. controlla se la mela e' stata mangiata, se e' cosi' ne genera un'altra
    controllaMelaMangiata();
    // 5. controlla se la posizione attuale del serpente implica la fine della parita
    if (controllaSconfitta() == true){
        finePartita();
    }
    // 6. stampo snake
    stampaSnake();
    // 7. timout
    tOut = setTimeout("muoviSnake();", 200); 
}

function controllaSconfitta(){
    //se lo snake si tocca la coda o se tocca il bordo la partita si conclude
    if (campo[posSn_x][posSn_y] == 1 || posSn_y < 0 || posSn_y >= DIM ||posSn_x <= 0 || posSn_x >= DIM-1 ){
        return true;
    }
}

function scorriCoda(){
    for(let i = cntCoda; i >= 0; i--){ //il contenuto di ogni cella scorre di 1 e la prima posizione viene liberata
        coda[i] = coda[i-1];
    }
    coda[0] = posSn_x + "," + posSn_y;  //la prima posizione viene riempita con la posizione attuale della testa dello snake
}

function controllaMelaMangiata(){
    if(campo[posSn_x][posSn_y] == 2){  //se lo snake capita sul bottone assegnato alla mela una cella in piu' del vettore coda viene riempita
        coda.push(posSn_x + "," + posSn_y);
        cntCoda++;
        campo[posSn_x][posSn_y] = 0;
        generaCibo(); //viene generata una nuova mela
    }
}

function cambiaDirezione(event) {  //in base al tasto premuto lo snake cambia la propria direzione
    let codice = event.keyCode;
    if (codice == 37 && direzione != 'dx') {
        direzione = "sx"; 
    }
    if (codice == 38 && direzione != 'dw') {
        direzione = "up";
    }
    if (codice == 39 && direzione != 'sx') {
        direzione = "dx";
    }
    if (codice == 40 && direzione != 'up') {
        direzione = "dw"; 
    }
}
function resettaSnake() { //tutte le celle del campo in cui e' presente lo snake vengono ripulite
    for (let i = 0; i < DIM; i++) {
        for (let j = 0; j < DIM; j++) {
            if (document.getElementById("btn_" + i + "_" + j).style.backgroundColor == BLU) {
                document.getElementById("btn_" + i + "_" + j).style.backgroundColor = GRIGIO;
                campo[i][j] = 0;
            }
        }
    }
}

function stampaSnake() {
    for(let i = 0; i < cntCoda+1; i++){ //la funzione stampa tutto il serpente (contenuto nel vettore coda)
        let vect = coda[i].split(",");
        document.getElementById("btn_" + vect[0] + "_" + vect[1]).style.backgroundColor = BLU;
        campo[vect[0]][vect[1]] = 1;
    }
    
}

function finePartita(){
    //stampa il messaggio della sconfitta piu' il punteggio
    document.getElementById("stampaMessaggi").innerHTML = "hai perso, hai totalizzato " + cntCoda +(cntCoda == 1 ? " punto!" : " punti!");
    //il bottone per rigiocare viene stampato a schermo
    document.getElementById("rigioca").value = "Premi qui per rigiocare";
    document.getElementById("rigioca").readOnly = true;
    document.getElementById("rigioca").style.visibility = "visible";
}