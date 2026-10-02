---
name: Novum Store
description: Vetrina semplice in bianco e nero per un negozio di streetwear; i capi si gestiscono da un solo file e le richieste arrivano su WhatsApp.
colors:
  ink: "#0a0a0a"
  ink-2: "#121212"
  ink-3: "#1b1b1a"
  paper: "#f6f4f0"
  oak: "#d8d2c8"
  concrete: "#8f8c87"
  line: "rgb(246 244 240 / 0.14)"
  line-strong: "rgb(246 244 240 / 0.32)"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 4.25rem)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, min(3.9vw, 6.6svh), 3.75rem)"
    fontWeight: 850
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  photo-overlay:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.14em"
  signature:
    fontFamily: "Great Vibes, cursive"
    fontSize: "clamp(3.5rem, 11vw, 9rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "12px"
  lg: "14px"
  card: "18px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(72px, 9vw, 140px)"
  grid-gap: "clamp(14px, 1.8vw, 24px)"
components:
  button-primary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 1.25em"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.oak}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 1.25em"
    height: "46px"
  chip:
    textColor: "{colors.oak}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
  chip-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  product-media:
    backgroundColor: "{colors.ink-3}"
    rounded: "{rounded.md}"
---

# Design System: Novum Store

## Overview

**Vetrina in nero.** Foto verticali dei capi, maiuscole bianche larghissime sopra la foto, prezzo sempre visibile. Il proprietario carica solo capi con foto (`capi.js`) e gestisce tutto su WhatsApp; niente reel o contenuti da produrre a parte (decisione del 2026-10-02). Il nero copre tutta la superficie e il bianco è l'unico inchiostro; il beige del parquet del negozio (oak) e il grigio cemento sono gli unici toni secondari.

Ogni schermata deve dire cosa c'è, quanto costa, dove si trova il negozio e come scrivere su WhatsApp. Le chicche (logo a strass che reagisce al cursore, stato aperto/chiuso dal vivo, scorciatoie da tastiera, Konami code, messaggio in console) sono premi, mai ostacoli.

## Colors

### Primary
- **Ink** `#0a0a0a`: il fondo di tutto.
- **Paper** `#f6f4f0`: l'unico inchiostro; anche il fondo dei bottoni primari.

### Neutral
- **Oak** `#d8d2c8`: testo secondario, icone, hover dei bottoni primari.
- **Concrete** `#8f8c87`: metadati (contrasto 5.7:1 su ink).
- **Ink 2 / Ink 3**: popover e segnaposto delle immagini.
- **Line / Line strong**: filetti al 14% e al 32% di paper.

### Named Rules
- **The One Ink Rule.** Nessun colore d'accento. L'enfasi viene da peso, larghezza e scala, oppure dall'inversione paper su ink.

## Typography

Un'unica famiglia variabile, **Archivo**, usata sull'asse della larghezza: wdth 118–125 per titoli in maiuscolo e nomi dei capi sopra la foto, wdth 100–112 per testo e controlli. **Great Vibes** solo come firma del marchio (header e chiusura), mai per i contenuti.

### Hierarchy
- Display (H2 di sezione): 900, wdth 122, maiuscolo, -0.03em.
- Headline (H1 hero): 850, wdth 118; scala sia con la larghezza sia con l'altezza, così la prima schermata sta tutta nel viewport.
- Nome sopra foto: 900, wdth 125, maiuscolo, ombra morbida solo sopra la foto.
- Body: 400, 17px, 1.55, misura massima ~46–52ch.
- Label: 600, 12px, maiuscolo spaziato, solo metadati brevi.
- Numeri sempre `tabular-nums`.

## Layout

Contenitore massimo 1440px, gutter fluido 16–56px. Sezioni separate da un filetto e da 72–140px d'aria. La hero a due colonne occupa esattamente il viewport (`--fold` = altezza schermo − barra); logo a strass, titolo, muro di capi e spaziature scalano in `svh`. Sotto i 900px la hero diventa una colonna: logo, foto a tutto schermo con logo, titolo e un bottone. Home: una riga con i primi 4 capi di `capi.js` e un bottone verso il catalogo. Ogni sezione della home sta in una schermata sotto la barra (foto e spaziature limitate in `svh`, `--sec-pad`); Negozio: la foto del negozio (`img/negozio.jpg`) è l'elemento principale a sinistra; a destra stato aperto/chiuso, orari grandi (riga di oggi in bianco), mappa che riempie lo spazio e bottoni Indicazioni/Chiama. Su telefono si toglie ciò che è già nella barra in basso (bottoni del negozio, passi dei contatti, link per capo). Su mobile una barra fissa in basso porta WhatsApp e Indicazioni.

## Elevation & Depth

Piatto. La profondità viene dai filetti e dall'inversione paper/ink. L'unica "ombra" è la sfumatura che rende leggibile il testo sopra le foto.

## Shapes

Pillole (999px) per bottoni e chip; 12–14px per foto e blocchi; 16px per foto del negozio e mappa.

## Components

### Buttons
Primario: pillola paper su ink, peso 700, wdth 112, hover oak. Secondario: pillola trasparente con filetto `line-strong`; in hover il filetto diventa paper e la freccia scorre di 3px. La CTA principale dell'hero rivela una tag spray disegnata a scatti.

### Chips
Filtri di categoria con conteggio; lo stato attivo è l'inversione paper/ink. Tasti 1–6.

### Product tile
Foto 3:4 su ink-3, raggio 12px, pillola "Nuovo" sui 3 arrivi più recenti, nome a sinistra e prezzo a destra, metadati in concrete, link "Chiedi su WhatsApp" con messaggio precompilato.

### Navigation
Barra fissa ink al 92% con blur, logo in corsivo + ABBIGLIAMENTO, link oak che diventano paper con sottolineatura, stato del negozio dal vivo, bottone WhatsApp.

### Muro di capi (home)
L'hero è a tutto schermo: dietro, colonne verticali di foto dei capi (4 su desktop, 2 su tablet, 1 su telefono) con 2px di separazione. Ogni 2.6s una colonna alla volta, in sequenza, passa al capo successivo di `capi.js` con una tendina che sale (clip-path, 1.1s) e un lento zoom 1.1→1 su 9s. Sopra: sfumature nere in alto e in basso, logo a strass, titolo in maiuscolo wdth 122 e due bottoni (catalogo pieno, WhatsApp vetro scuro; su telefono solo il catalogo, WhatsApp sta nella barra in basso). Nessun controllo: le colonne sono solo cliccabili verso il capo nel catalogo. Si ferma fuori schermo e con prefers-reduced-motion.

### Ultimi arrivi (home)
I primi 4 capi di `capi.js` in una griglia pulita: foto verticali 3:4 intere (mai schiacciate: la griglia si restringe sugli schermi bassi), sotto nome e prezzo, poi "Chiedi su WhatsApp"; bottone "Vai al catalogo". Su telefono 2×2 con solo foto, nome e prezzo. Le grucce/cartellini scorrevoli sono stati provati e scartati dal cliente (troppo effetto, poco professionale).

### Cursore (solo mouse, solo home)
Il cursore resta quello di sistema. Sopra le foto dei capi (muro iniziale, Ultimi arrivi, foto del negozio) un **faretto** morbido segue il cursore scurendo leggermente il resto della foto; se il cursore si ferma ~0.65s compare per 0.6s un **brillio di strass** a quattro punte (max uno ogni 1.4s). Disattivato su touch, con prefers-reduced-motion e nel catalogo.

### Menu e barra in basso
Sotto i 1080px il menu del header diventa un pulsante "Menu" che apre un pannello a tutto schermo con voci giganti in maiuscolo (wdth 125), stato del negozio e WhatsApp. Su telefono la barra fissa in basso ha tre voci: Catalogo (Home nel catalogo), WhatsApp in evidenza, Indicazioni. Lo stato in alto usa una forma breve ("Aperto · 20:00").

### Mappa su richiesta
La mappa di Google non si carica da sola: al suo posto un pannello con indirizzo, "Mostra la mappa" e "Apri in Google Maps". La scelta viene ricordata sul dispositivo. Font ospitati sul sito (`fonts/`), nessuna risorsa Google caricata senza consenso. Pagine `privacy.html` e `404.html` nello stesso stile.

### Pagina Catalogo (eccezione voluta: zero estetica)
`catalogo.html` non segue il mondo nero della home: su richiesta del cliente è neutra come un e-commerce tipo Zara, così contano solo i capi. Fondo bianco, testo nero, griglia di foto **quadrate** quasi a filo (4 colonne, 3 sotto i 1080px, 2 sotto i 760px), sotto solo nome in maiuscolo e prezzo a 12px. Filtri come testo sottolineato, ordinamento come testo, bottoni rettangolari neri. Il clic su un capo apre il visore (`<dialog>`) bianco con foto intera, frecce, swipe, ←/→, "Chiedi su WhatsApp" e link condivisibile `catalogo.html#id-capo`. Implementato come override dei token sotto `.page-catalog`.

### Strass wordmark (signature)
"NOVUM" campionato da Archivo 900 ultra-espanso su griglia sfalsata e disegnato come strass. I punti si sparpagliano sotto il cursore o il dito e tornano a posto con una molla, con qualche bagliore a croce. Con prefers-reduced-motion è statico.

## Do's and Don'ts

### Do:
- Mostra sempre prezzo, stato del negozio e un modo per scrivere su WhatsApp entro un tocco.
- Usa le foto vere del negozio e delle persone che ci passano.
- Niente segnali da sito non finito: niente etichette demo, date che invecchiano o testi segnaposto.
- Tieni la prima schermata desktop dentro il viewport.

### Don't:
- Non introdurre un colore d'accento o gradienti decorativi.
- Non mettere etichette o eyebrow sopra i titoli.
- Non aggiungere contenuti che il negozio dovrebbe produrre a parte (reel, video, storie).
- Non usare Great Vibes per testo che va letto.
- Non inventare recensioni, numeri di clienti o promozioni.
