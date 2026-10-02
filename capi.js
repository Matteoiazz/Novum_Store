/*
  ============================================================
  CAPI DEL NEGOZIO — questo è l'unico file da modificare
  ============================================================

  Per AGGIUNGERE un capo:
    1. Metti la foto nella cartella  img/capi/  (es. felpa-nera.jpg).
       Meglio verticale, almeno 1000 px di altezza, capo ben al centro.
    2. Copia una riga qui sotto e incollala IN CIMA all'elenco
       (i primi dell'elenco compaiono in home come "Ultimi arrivi").
    3. Cambia i valori:
         nome         come lo vuoi vedere sul sito
         categoria    una tra: camicie, tshirt, felpe, denim, set, accessori
         prezzo       solo il numero, in euro
         foto         il percorso della foto
         inquadratura (facoltativo) "alto", "centro" o "basso":
                      quale parte della foto tenere quando viene ritagliata
    4. Salva.

  Per TOGLIERE un capo venduto: cancella la sua riga.
*/
window.NOVUM_CAPI = [
  { nome: "Camicia flanella con fiamme di strass", categoria: "camicie", prezzo: 79,  foto: "img/ig/ig01.jpg", inquadratura: "centro" },
  { nome: "Felpa “Again” aquila e strass",         categoria: "felpe",   prezzo: 69,  foto: "img/ig/ig02.jpg", inquadratura: "centro" },
  { nome: "Giacca e jeans denim nero",             categoria: "denim",   prezzo: 129, foto: "img/ig/ig03.jpg", inquadratura: "alto" },
  { nome: "Longsleeve “It’s never luck” camo",     categoria: "tshirt",  prezzo: 49,  foto: "img/ig/ig04.jpg", inquadratura: "alto" },
  { nome: "Set camicia e bermuda bicolore",        categoria: "set",     prezzo: 89,  foto: "img/ig/ig08.jpg", inquadratura: "centro" },
  { nome: "Bermuda denim nero raggi di strass",    categoria: "denim",   prezzo: 59,  foto: "img/ig/ig09.jpg", inquadratura: "basso" },
  { nome: "Set camicia e short fiamme elettriche", categoria: "set",     prezzo: 85,  foto: "img/ig/ig10.jpg", inquadratura: "centro" },
  { nome: "Set camicia e bermuda camo",            categoria: "set",     prezzo: 95,  foto: "img/ig/ig11.jpg", inquadratura: "centro" },
];

// Nomi delle categorie come appaiono nei filtri del catalogo.
// Le categorie senza capi non vengono mostrate.
window.NOVUM_CATEGORIE = {
  camicie: "Camicie",
  tshirt: "T-shirt e polo",
  felpe: "Felpe",
  denim: "Denim",
  set: "Set",
  accessori: "Accessori",
};
