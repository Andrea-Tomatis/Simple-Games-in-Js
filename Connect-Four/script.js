"use strict"

/* costanti per colori */
const GRIGIO = "rgb(127, 127, 127)";
const BIANCO = "rgb(255, 255, 255)"; // #FFFFFF
const ROSSO = "rgb(255, 0, 0)";
const BLU = "rgb(0, 0, 255)";
const GIALLO = "rgb(255,255,0)";

const LUNG_CAMPO = 7; //dimensione della tabella


var campo = new Array; //campo da gioco
var cntPlayer = 0; //contatore dei turni
var dir = new Array; //vettore direzioni (vedere controllavittoria();)


/*
-----------LEGENDA MATRICE CAMPO-------------
0 = non cliccabile e non ancora selezionata
1 = cliccabile ma non ancora selezionata
2 = gia' cliccata dal giocatore 1
3 = gia' cliccata dal giocatore 2
*/


function start(){
    initMatrice(); //resetta la matrice campo a 0, a parte una linea in basso
    disegnaCampo(); //crea la tabella di bottoni
}


function initMatrice(){
    //il vettore campo diventa una matrice
    for (let i = 0; i < LUNG_CAMPO; i++) 
        campo[i] = new Array;
    //ogni cella viene settata a 0
    for (let i = 0; i < LUNG_CAMPO; i++) 
        for (let j = 0; j < LUNG_CAMPO; j++)
            campo[i][j] = 0;
    //la prima riga in basso viene settata ad 1
    for(let i = 0; i < LUNG_CAMPO; i++){
        campo[LUNG_CAMPO-1][i] = 1;
    }
}


function disegnaCampo(){
    //accesso al componente <div> tramite id
    var refbody = document.getElementById("campo_gioco");
    //creazione tabella  
    var table = document.createElement("table");

    //creazione variabili riga,cella e bottone
    var cella, riga, btn;
    //impostazioni grafiche tabella
    table.style.margin = "20px auto";
    table.style.borderSpacing = "0";
    refbody.appendChild(table);
    

    //creazione contenuto tabella
    for (let i = 0; i < LUNG_CAMPO; i++){
        //creazione riga
        riga = document.createElement("tr"); 
        table.appendChild(riga);

        for (let j = 0; j < LUNG_CAMPO; j++){
            //creazione cella
            cella = document.createElement("td");
            cella.style.width = "18px";
            riga.appendChild(cella);
            
            //creazione bottone + impostazione layout dello stesso
            btn = document.createElement("input");
            btn.type = "button";
            btn.id = "btn_" + i + "_" + j; // btn_riga_colonna
            btn.style.width = "60px";
            btn.style.height = "60px";
            btn.style.backgroundColor = BIANCO;
            btn.value = " ";
            btn.setAttribute("class","button");
            btn.style.fontSize = "40px";
            btn.setAttribute("OnClick","segnaCella(this);")
            cella.appendChild(btn);

        }
    }
}

function segnaCella(btn){  //funzione che contrassegna la cella premuta
    let vect = btn.id.split("_"); //separazione botton id in vettore per ricavarne le coordinate
    
    if(btn.style.backgroundColor == BIANCO){ //se la cella non e' ancora stata selezionata la si contrassegna
        //nel caso in cui la cella premuta non sia cliccabile la cella da contrassegnare scorre in basso fino alla prima posizione cliccabile 
        let y;
        y = vect[1];
        while(campo[y][vect[2]] != 1){
            y++;
        }
        vect[1] = y;

        //se la cella con y minore (sopra) rispetto alla cella selezionata esiste la si rende cliccabile
        if (vect[1]-1 >= 0) campo[vect[1]-1][vect[2]] = 1;

        //in base al giocatore la cella selezionata viene colorata di rosso o blu e nella matrice campo viene contrassegnata con un 2 o un 3
        if (cntPlayer % 2 == 0){
            campo[vect[1]][vect[2]] = 2;
            document.getElementById(vect[0] + "_" + vect[1] + "_" + vect[2]).style.backgroundColor = BLU;  
        }else{
            campo[vect[1]][vect[2]] = 3;
            document.getElementById(vect[0] + "_" + vect[1] + "_" + vect[2]).style.backgroundColor = ROSSO; 
        }
        //incremento del contatore giocatore per passare al prossimo turno + stampa del messaggio 
        cntPlayer++;
        stampaturno();
        //controllo sulle caselle circostanti a quella premuta per individuare eventuali serie di 4 celle consecutive 
        controllavittoria(vect);
    }
    
    
}

function controllavittoria(vect){ //controlla se l'ultima cella selezionata comporta la vittoria di un giocatore
    
    let numPlayer; //determina quale giocatore ha premuto la cella
    let vittoria = false; //se vale true la partita si conclude
    let k = 0; //conta le caselle dello stesso colore di quella premuta attorno ad essa
    //btn contiene le coordinate del pulsante premuto. Non viene passato come parametro perche' c'e' la possibilita' che la cella contrassegnata
    //non sia la stessa cliccata dal giocatore in virtu' della "gravita'", quindi l'id viene calcolato
    let btn = document.getElementById(vect[0] + "_" + vect[1] + "_" + vect[2]); 
    //determina se ha giocato il player1 ha giocato o il 2
    if (btn.style.backgroundColor == BLU) numPlayer = 2;
    else if (btn.style.backgroundColor == ROSSO) numPlayer = 3;
    //inizializza la matrice dir a 0. In seguito conterra' le coordinate delle caselle circostanti a quella premuta del suo stesso colore
    initDir();
    

    /*
    Nella serie di 7 if che seguono ogni cella circostante a quella premuta a partire da quella in alto a sinistra viene controllata e, se del
    medesimo valore di numPlayer le sue coordinate rispetto alla posizione del tasto premuto vengono aggiunte alla matrice dir;
    */
    if(somma(vect[1],-1) >= 0 && somma(vect[2],-1) >= 0 && campo[somma(vect[1],-1)][somma(vect[2],-1)] == numPlayer){
        dir[k][0] = -1;
        dir[k][1] = -1;
        k++;
    }
    
    if(somma(vect[1],-1) >= 0 && somma(vect[2],1) < LUNG_CAMPO && campo[somma(vect[1],-1)][somma(vect[2],1)] == numPlayer){
        dir[k][0] = 1;
        dir[k][1] = -1;
        k++;
    }
    if(somma(vect[2],1) < LUNG_CAMPO && campo[vect[1]][somma(vect[2],1)] == numPlayer){
        dir[k][0] = 1;
        dir[k][1] = 0;
        k++;
    }
    if(somma(vect[1],1) < LUNG_CAMPO && somma(vect[2],1) < LUNG_CAMPO && campo[somma(vect[1],1)][somma(vect[2],1)] == numPlayer){
        dir[k][0] = 1;
        dir[k][1] = 1;
        k++;
    }
    if(somma(vect[1],1) < LUNG_CAMPO && campo[somma(vect[1],1)][vect[2]] == numPlayer){
        dir[k][0] = 0;
        dir[k][1] = 1;
        k++;
    }
    if(somma(vect[1],1) < LUNG_CAMPO && somma(vect[2],-1) >= 0 && campo[somma(vect[1],1)][somma(vect[2],-1)] == numPlayer){
        dir[k][0] = -1;
        dir[k][1] = 1;
        k++;
    }
    if(somma(vect[2],-1) >= 0 && campo[vect[1]][somma(vect[2],-1)] == numPlayer){
        dir[k][0] = -1;
        dir[k][1] = 0;
        k++;
    }
    
    //finche' vittoria resta falsa e in contatore i e' minore della dimensione del vettore dir (ovvero k) dir viene fatto scorrere 
    //in cerca di una serie di 4 caselle uguali
    for(let i = 0; i < k && vittoria == false; i++){
        let x,y,cnt;
        cnt = 0;
        x = dir[i][0];
        y = dir[i][1];
        var posx,posy;
        posx = vect[2];
        posy = vect[1];
        //il ciclo while cerca la serie e si interrompe se arriva ai limite del campo, se la serie si interrompe o se cnt arriva a 4
        while(posx < LUNG_CAMPO && posy < LUNG_CAMPO && posx >= 0 && posy >= 0 && campo[posy][posx] == numPlayer && cnt < 4){ 
            posy = somma(posy,y);
            posx = somma(posx,x); 
            cnt++;
        }
            
        if (cnt == 4) vittoria = true; //se la serie conta 4 caselle di fila(in una qualsiasi direzione) viene decretata la vittoria
    }
    
    //se un giocatore ha vinto il programma determina quale e' dei due e chiama la funzione fine partita
    if (vittoria == true){
        if(cntPlayer % 2 == 0) fineParita("GIOCATORE 2 VINCE");
        else fineParita("GIOCATORE 1 VINCE");
    }
}

function initDir(){  //funzione per inizializzare la matrice dim a 0
    for(let i = 0; i < 8; i++)
        dir[i] = new Array;
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 2; j++){
            dir[i][j] = 0;
        }
    }
}


function somma(a,b){ //funzione di somma per evitare concatenamenti inaspettati invece che somme numeriche
    var z = parseInt(a) + parseInt(b);
    return z;
}

function stampaturno(){ //stampa a schermo del turno da giocare
    document.getElementById("messaggi_a_schermo").innerHTML = "Ora tocca al giocatore " + (cntPlayer%2+1);
}

function fineParita(winner){  //reset totale della tabella e della matrice campo + messaggio di vittoria
    for (let i = 0; i < LUNG_CAMPO; i++){
        for (let j = 0; j < LUNG_CAMPO; j++){
            document.getElementById("btn_" + i + "_" + j).style.backgroundColor = BIANCO;
            campo[i][j] = 0;
        }
    }
    for(let i = 0; i < LUNG_CAMPO; i++){
        campo[LUNG_CAMPO-1][i] = 1;
    }
    cntPlayer = 0; //reset del contatore di turni
    document.getElementById("messaggi_a_schermo").innerHTML = winner;
}