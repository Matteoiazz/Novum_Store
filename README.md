# Novum Store — vetrina (demo)

Sito statico, nessuna dipendenza. Online su https://novumstore-smoky.vercel.app

## Aggiungere o togliere un capo
Tutto si fa nel file **`capi.js`** (istruzioni in cima al file):
1. Metti la foto in `img/capi/`.
2. Copia una riga e incollala **in cima** all'elenco: i primi compaiono in home come "Ultimi arrivi".
3. Facoltativo: `inquadratura: "alto" | "centro" | "basso"` sceglie quale parte della foto tenere nei ritagli.
4. Per un capo venduto, cancella la sua riga.

La vetrina che ruota in home, gli "Ultimi arrivi", i filtri e il catalogo si aggiornano da soli.
Le richieste dei clienti arrivano su WhatsApp con il nome del capo già scritto.

## Da fare con il negozio
- Sostituire capi, prezzi e foto con quelli reali (le foto attuali vengono da Instagram, bassa risoluzione).
- Logo in versione vettoriale (ora il corsivo è reso con il font Great Vibes).
- Ferie e chiusure: `CLOSURES` in `app.js`.

## Chicche
- Logo NOVUM a strass: passa il mouse o il dito.
- Stato aperto/chiuso dal vivo (ora di Roma) con conto alla rovescia.
- Tasto `?`: scorciatoie (nascoste). Nel catalogo `←/→` per scorrere le foto, `1–9` per i filtri.
- Konami code (↑↑↓↓←→←→BA): modalità strass.
- Apri la console del browser.
- `?still` nell'URL disattiva le animazioni (utile per gli screenshot).

## Provarlo in locale
```bash
npx http-server -p 5173
```
