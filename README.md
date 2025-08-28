# PDF Merged

Questa è un'applicazione web che consente di unire più file PDF in un unico documento. È costruita con React, TypeScript e Vite, e utilizza la libreria `pdf-lib` per la manipolazione dei PDF.

## Funzionalità

- Selezionare più file PDF dal proprio computer.
- Unire i file PDF selezionati in un unico documento.
- Visualizzare un'anteprima del PDF unito.
- Scaricare il file PDF unito con un nome personalizzato.
- Interfaccia utente semplice e intuitiva.

## Tecnologie Utilizzate

- **React**: Libreria JavaScript per la creazione di interfacce utente.
- **TypeScript**: Superset di JavaScript che aggiunge la tipizzazione statica.
- **Vite**: Strumento di build per lo sviluppo web moderno.
- **pdf-lib**: Libreria per la creazione e la modifica di documenti PDF con JavaScript.
- **Tailwind CSS**: Framework CSS per la creazione di interfacce personalizzate.
- **Iconoir React**: Libreria di icone SVG.

## Come Iniziare (per sviluppatori)

Per eseguire il progetto in locale, segui questi passaggi:

1. **Clona la repository:**

    ```bash
    git clone https://github.com/tuo-username/pdf-merged.git
    cd pdf-merged
    ```

2. **Installa le dipendenze:**

    Assicurati di avere [Node.js](https://nodejs.org/) installato. Poi, esegui il seguente comando:

    ```bash
    npm install
    ```

3. **Avvia il server di sviluppo:**

    ```bash
    npm run dev
    ```

    L'applicazione sarà disponibile all'indirizzo `http://localhost:5173`.

## Script Disponibili

Nel progetto, sono disponibili i seguenti script:

- `npm run dev`: Avvia l'applicazione in modalità di sviluppo.
- `npm run build`: Compila l'applicazione per la produzione nella cartella `dist`.
- `npm run lint`: Esegue l'analisi statica del codice con ESLint.
- `npm run preview`: Avvia un server locale per visualizzare la build di produzione.

## Utilizzo (per utenti)

Per utilizzare l'applicazione, segui questi passaggi:

1. Apri l'applicazione nel tuo browser.
2. Clicca su **Seleziona i PDF** per scegliere i file che desideri unire. Puoi selezionare più file contemporaneamente.
3. (Opzionale) Inserisci un nome per il file unito nel campo **Nome file Mergiato**. Se non inserisci un nome, il file verrà salvato come `merged.pdf`.
4. Clicca su **Unisci PDF**.
5. Verrà visualizzata un'anteprima del PDF unito.
6. Clicca su **Scarica PDF** per salvare il file sul tuo computer.
7. Per unire altri file, clicca su **Unisci altri PDF**.

## Contribuire

I contributi sono i benvenuti! Se desideri contribuire al progetto, per favore apri una issue o una pull request.

---
