---
name: Novum Store
description: Drop Reel — la vetrina che racconta ogni drop come i reel del negozio.
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
  reel-overlay:
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
  reel: "18px"
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

**Drop Reel.** Il sito parla la lingua che il negozio usa già su Instagram: drop numerati, fotogrammi verticali 9:16, maiuscole bianche larghissime sopra la foto, barre di avanzamento. Il nero copre tutta la superficie e il bianco è l'unico inchiostro; il beige del parquet del negozio (oak) e il grigio cemento sono gli unici toni secondari. Le transizioni sono tagli di montaggio: due fotogrammi, niente dissolvenze.

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

Un'unica famiglia variabile, **Archivo**, usata sull'asse della larghezza: wdth 118–125 per la voce dei reel (titoli in maiuscolo, contatori, nomi dei capi sopra la foto), wdth 100–112 per testo e controlli. **Great Vibes** solo come firma del marchio (header e chiusura), mai per i contenuti.

### Hierarchy
- Display (H2 di sezione): 900, wdth 122, maiuscolo, -0.03em.
- Headline (H1 hero): 850, wdth 118; scala sia con la larghezza sia con l'altezza, così la prima schermata sta tutta nel viewport.
- Reel overlay: 900, wdth 125, maiuscolo, ombra morbida solo sopra la foto.
- Body: 400, 17px, 1.55, misura massima ~46–52ch.
- Label: 600, 12px, maiuscolo spaziato, solo metadati brevi.
- Numeri sempre `tabular-nums`.

## Layout

Contenitore massimo 1440px, gutter fluido 16–56px. Sezioni separate da un filetto e da 72–140px d'aria. La hero a due colonne occupa esattamente il viewport (`--fold` = altezza schermo − barra − striscia demo); logo a strass, titolo, reel e spaziature scalano in `svh`. Sotto i 900px la hero diventa una colonna: logo, titolo, reel, poi testo e azioni. Catalogo a 4 colonne (2 sotto i 1080px) con due capi in evidenza 2×2 a incastro. Su mobile una barra fissa in basso porta WhatsApp e Indicazioni.

## Elevation & Depth

Piatto. La profondità viene dai filetti e dall'inversione paper/ink. L'unica "ombra" è la sfumatura che rende leggibile il testo sopra le foto del reel.

## Shapes

Pillole (999px) per bottoni e chip; 12–14px per foto e blocchi; 18px per la cornice del reel; 4px per l'etichetta DEMO.

## Components

### Buttons
Primario: pillola paper su ink, peso 700, wdth 112, hover oak. Secondario: pillola trasparente con filetto `line-strong`; in hover il filetto diventa paper e la freccia scorre di 3px. La CTA principale dell'hero rivela una tag spray disegnata a scatti.

### Chips
Filtri di categoria con conteggio; lo stato attivo è l'inversione paper/ink. Tasti 1–6.

### Product tile
Foto 3:4 su ink-3, raggio 12px, pillola "Nuovo" sui 3 arrivi più recenti, nome a sinistra e prezzo a destra, metadati in concrete, link "Chiedi su WhatsApp" con messaggio precompilato.

### Navigation
Barra fissa ink al 92% con blur, logo in corsivo + ABBIGLIAMENTO, link oak che diventano paper con sottolineatura, stato del negozio dal vivo, bottone WhatsApp.

### Drop Reel (signature)
Cornice 9:16, barre di avanzamento segmentate (5.2s lineari), "NEW DROP 01/06", zone tap, swipe, pausa (hover, fuori schermo, tab nascosto), ←/→ e Spazio. Ogni cambio è un taglio secco con un lampo paper al 22% per due fotogrammi (90ms steps).

### Pagina Catalogo
`catalogo.html`: titolo CATALOGO a wdth 125, barra filtri e ordinamento fissa sotto la navigazione, griglia di schede grandi (3 colonne, 2 sotto i 1080px, 1 sotto i 640px) con foto 4:5, nome e prezzo grandi, bottone "Chiedi su WhatsApp". Il clic sulla foto apre un visore (`<dialog>`) con foto intera, frecce, swipe, ←/→ e link condivisibile `catalogo.html#id-capo`; dalla home ogni foto porta al capo nel visore.

### Strass wordmark (signature)
"NOVUM" campionato da Archivo 900 ultra-espanso su griglia sfalsata e disegnato come strass. I punti si sparpagliano sotto il cursore o il dito e tornano a posto con una molla, con qualche bagliore a croce. Con prefers-reduced-motion è statico.

## Do's and Don'ts

### Do:
- Mostra sempre prezzo, stato del negozio e un modo per scrivere su WhatsApp entro un tocco.
- Usa le foto vere del negozio e delle persone che ci passano.
- Etichetta come DEMO ogni dato dimostrativo.
- Tieni la prima schermata desktop dentro il viewport.

### Don't:
- Non introdurre un colore d'accento o gradienti decorativi.
- Non mettere etichette o eyebrow sopra i titoli.
- Non usare dissolvenze lunghe per i cambi di contenuto: si taglia.
- Non usare Great Vibes per testo che va letto.
- Non inventare recensioni, numeri di clienti o promozioni.
