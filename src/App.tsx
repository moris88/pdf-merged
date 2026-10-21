import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Undo, Drag, HalfMoon, SunLight, Trash, NavArrowUp, NavArrowDown } from 'iconoir-react';

function App() {
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [nameFile, setNameFile] = useState<string>("merged");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [iframeZoomed, setIframeZoomed] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  // Applichiamo il tema e lo salviamo in localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    } catch {
      // localStorage non disponibile
    }
  }, [darkMode]);

  function includesPdfName(name: string): string {
    if (name.toLowerCase().endsWith(".pdf")) {
      return name;
    }
    return name + ".pdf";
  }

  // Sposta un file nella lista per cambiare l'ordine di unione
  function moveFile(from: number, to: number) {
    setSelectedFiles((prev) => {
      const files = [...prev];
      const [file] = files.splice(from, 1);
      files.splice(to, 0, file);
      return files;
    });
  }

  async function handleMerge(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedFiles.length < 2) {
      alert("Seleziona almeno 2 PDF!");
      return;
    }

    // Creiamo un nuovo PDF vuoto
    const mergedPdf = await PDFDocument.create();

    // Iteriamo sui file selezionati
    for (const file of selectedFiles) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => mergedPdf.addPage(p));
    }

    // Convertiamo in Blob per mostrarlo/scaricarlo
    const mergedBase64 = await mergedPdf.saveAsBase64();
    const blob = new Blob([Uint8Array.from(atob(mergedBase64), c => c.charCodeAt(0))], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setMergedPdfUrl(url);
    setShowPreview(true);
  }

  if (iframeZoomed && mergedPdfUrl) {
    return (
      <div className="flex flex-col items-center relative">
        <button
          onClick={() => {
            setIframeZoomed(false);
          }}
          className="absolute top-2 right-35 border border-blue-600 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          <Undo />
        </button>
        <iframe
          src={mergedPdfUrl}
          title="Anteprima PDF unito"
          className="w-screen h-screen border rounded-lg shadow"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-6 relative">
      <button
        onClick={() => setDarkMode(!darkMode)}
        title={darkMode ? "Modalità chiara" : "Modalità scura"}
        className="absolute top-4 right-4 p-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 cursor-pointer"
      >
        {darkMode ? <SunLight /> : <HalfMoon />}
      </button>
      <h1 className="text-2xl font-bold mb-4">{mergedPdfUrl ? 'PDF unito' : 'Unisci i tuoi PDF'}</h1>
      {!showPreview && (<form onSubmit={handleMerge} className="flex flex-col items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <span className="flex flex-col items-center gap-2">
          <label htmlFor="files"><b>Seleziona i PDF: </b></label>
          <input
            type="file"
            id="files"
            name="files"
            accept="application/pdf"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                // Aggiungiamo i nuovi file a quelli già selezionati
                const newFiles = Array.from(e.target.files);
                setSelectedFiles((prev) => [...prev, ...newFiles]);
              }
              // Reset per poter riselezionare lo stesso file
              e.target.value = "";
            }}
            className="hidden"
          />
          {/* Input nativo nascosto: il pulsante apre il selettore file */}
          <span className="flex items-center gap-4">
            <label
              htmlFor="files"
              className="py-2 px-4 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-blue-300 cursor-pointer"
            >
              {selectedFiles.length > 0 ? "Aggiungi file" : "Scegli file"}
            </label>
            {selectedFiles.length === 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">Nessun file selezionato</span>
            )}
          </span>
          {/* Lista nomi file */}
          {selectedFiles.length > 0 && (
            <ul className="flex flex-col gap-1 w-full text-sm text-gray-700 dark:text-gray-300">
              {selectedFiles.map((file, idx) => (
                <li
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between gap-2 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700"
                >
                  <span className="truncate">{idx + 1}. {file.name}</span>
                  <span className="flex items-center">
                  <button
                    type="button"
                    title="Sposta su"
                    disabled={idx === 0}
                    onClick={() => moveFile(idx, idx - 1)}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <NavArrowUp />
                  </button>
                  <button
                    type="button"
                    title="Sposta giù"
                    disabled={idx === selectedFiles.length - 1}
                    onClick={() => moveFile(idx, idx + 1)}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <NavArrowDown />
                  </button>
                  <button
                    type="button"
                    title="Rimuovi file"
                    onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))}
                    className="p-1 rounded text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <Trash />
                  </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </span>
       
        <span className="flex flex-col items-center gap-2">
          <label htmlFor="nameFile"><b>Nome file Mergiato: </b></label>
          <input
            type="text"
            name="nameFile"
            placeholder="Nome del file (opzionale)"
            value={nameFile}
            onChange={(e) => setNameFile(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </span>
       
        <button
          type="submit"
          disabled={selectedFiles.length < 2}
          title={selectedFiles.length < 2 ? "Seleziona almeno 2 PDF" : undefined}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        >
          Unisci PDF
        </button>
      </form>)}

      {mergedPdfUrl && (
        <div className="flex flex-col items-center">
          <button
            onClick={() => {
              setIframeZoomed(true);
            }}
            className="my-4 bg-blue-600 border border-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            <Drag />
          </button>
          <iframe
            src={mergedPdfUrl}
            title="Anteprima PDF unito"
            className="w-[600px] h-[400px] border rounded-lg shadow"
          />
          <span className="flex items-center gap-2">
            <a
              href={mergedPdfUrl}
              download={includesPdfName(nameFile.trim() || "merged")}
              className="flex items-center gap-2 mt-4 bg-blue-600 border border-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Download />
              Scarica PDF
            </a>
            <button
              onClick={() => {
                setShowPreview(false);
                setMergedPdfUrl(null);
              }}
              className="flex items-center gap-2 mt-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 hover:text-white dark:hover:text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              <Undo /> Unisci altri PDF
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
