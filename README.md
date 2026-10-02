# Novum Store — vetrina (demo)

Sito statico, nessuna dipendenza. Online su https://novumstore-smoky.vercel.app

## Aggiungere o togliere un capo
Tutto si fa nel file **`capi.js`**:
1. Metti la foto in `img/capi/` (meglio verticale, almeno 1000 px di altezza).
2. Copia una riga dell'elenco e cambia nome, categoria, prezzo, foto e data di arrivo.
3. Per un capo venduto, cancella la sua riga.

Il capo più recente compare da solo in home come "Ultimo arrivo"; gli ultimi 8 nella sezione "Ultimi arrivi"; tutti nel catalogo.
Le richieste dei clienti arrivano su WhatsApp con il nome del capo già scritto.

## Da sostituire prima di andare online
- **Capi, prezzi e foto**: quelli attuali sono di esempio (foto dal profilo Instagram, bassa risoluzione).
- **Logo**: serve una versione vettoriale; ora il corsivo è reso con il font Great Vibes.
- **Chiusure**: aggiorna `CLOSURES` in `app.js` (es. ferie d'agosto).
- Togli la striscia "Anteprima demo" da `index.html` e `catalogo.html`.

## Chicche
- Logo NOVUM a strass: passa il mouse o il dito.
- Stato aperto/chiuso dal vivo (ora di Roma) con conto alla rovescia.
- Tasto `?`: scorciatoie. Nel catalogo `←/→` per scorrere le foto, `1–6` per i filtri.
- Konami code (↑↑↓↓←→←→BA): modalità strass.
- Apri la console del browser.
- `?still` nell'URL disattiva le animazioni (utile per gli screenshot).

## Provarlo in locale
```bash
npx http-server -p 5173
```
