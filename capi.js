/*
  ============================================================
  CAPI DEL NEGOZIO — questo è l'unico file da modificare
  ============================================================

  Per AGGIUNGERE un capo:
    1. Metti la foto nella cartella  img/capi/  (es. felpa-nera.jpg)
       Meglio verticale, almeno 1000 px di altezza.
    2. Copia una riga qui sotto e cambia i valori:
         nome       come lo vuoi vedere sul sito
         categoria  una tra: camicie, tshirt, felpe, denim, set, accessori
         prezzo     solo il numero, in euro
         foto       il percorso della foto
         data       giorno di arrivo, formato AAAA-MM-GG (serve per "Nuovo")
    3. Salva. Il capo compare in home (se è tra gli ultimi) e nel catalogo.

  Per TOGLIERE un capo venduto: cancella la sua riga.

  I capi qui sotto sono di ESEMPIO: nomi e prezzi sono indicativi.
*/
window.NOVUM_CAPI = [
  { nome: "Camicia flanella con fiamme di strass", categoria: "camicie", prezzo: 79,  foto: "img/ig/ig01.jpg", data: "2026-09-30" },
  { nome: "Felpa “Again” aquila e strass",         categoria: "felpe",   prezzo: 69,  foto: "img/ig/ig02.jpg", data: "2026-09-25" },
  { nome: "Giacca e jeans denim nero",             categoria: "denim",   prezzo: 129, foto: "img/ig/ig03.jpg", data: "2026-09-17" },
  { nome: "Longsleeve “It’s never luck” camo",     categoria: "tshirt",  prezzo: 49,  foto: "img/ig/ig04.jpg", data: "2026-09-10" },
  { nome: "Polo tecnica nera con profili bianchi", categoria: "tshirt",  prezzo: 45,  foto: "img/ig/ig05.jpg", data: "2026-08-28" },
  { nome: "T-shirt oversize ritratto",             categoria: "tshirt",  prezzo: 39,  foto: "img/ig/ig06.jpg", data: "2026-08-27" },
  { nome: "Set camicia e bermuda bicolore",        categoria: "set",     prezzo: 89,  foto: "img/ig/ig08.jpg", data: "2026-07-31" },
  { nome: "Bermuda denim nero raggi di strass",    categoria: "denim",   prezzo: 59,  foto: "img/ig/ig09.jpg", data: "2026-07-16" },
  { nome: "Set camicia e short fiamme elettriche", categoria: "set",     prezzo: 85,  foto: "img/ig/ig10.jpg", data: "2026-07-10" },
  { nome: "Set camicia e bermuda camo",            categoria: "set",     prezzo: 95,  foto: "img/ig/ig11.jpg", data: "2026-07-09" },
];

// Nomi delle categorie come appaiono nei filtri del catalogo.
window.NOVUM_CATEGORIE = {
  camicie: "Camicie",
  tshirt: "T-shirt e polo",
  felpe: "Felpe",
  denim: "Denim",
  set: "Set",
  accessori: "Accessori",
};
