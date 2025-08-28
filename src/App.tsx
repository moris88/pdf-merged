import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Undo, Drag } from 'iconoir-react';

function App() {
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [nameFile, setNameFile] = useState<string>("merged.pdf");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [iframeZoomed, setIframeZoomed] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  function includesPdfName(name: string): string {
    if (name.toLowerCase().endsWith(".pdf")) {
      return name;
    }
    return name + ".pdf";
  }

  async function handleMerge(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = event.currentTarget.elements.namedItem("files") as HTMLInputElement;
    if (!input?.files || input.files.length < 2) {
      alert("Seleziona almeno 2 PDF!");
      return;
    }

    // Creiamo un nuovo PDF vuoto
    const mergedPdf = await PDFDocument.create();

    // Iteriamo sui file selezionati
    for (const file of Array.from(input.files)) {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">{mergedPdfUrl ? 'PDF unito' : 'Unisci i tuoi PDF'}</h1>
      {!showPreview && (<form onSubmit={handleMerge} className="flex flex-col items-center gap-4 bg-white p-6 rounded-2xl shadow-md">
        <span className="flex flex-col items-center gap-2">
          <label htmlFor="files"><b>Seleziona i PDF: </b></label>
          <input
            type="file"
            name="files"
            accept="application/pdf"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setSelectedFiles(Array.from(e.target.files));
              }
            }}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                       file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
                       hover:file:bg-blue-100"
          />
          {/* Lista nomi file */}
          {selectedFiles.length > 0 && (
            <ul className="list-disc list-inside text-sm text-gray-700">
              {selectedFiles.map((file, idx) => (
                <li key={idx}>{file.name}</li>
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
            onChange={(e) => setNameFile(includesPdfName(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </span>
       
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
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
              download={nameFile}
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
              className="flex items-center gap-2 mt-4 bg-white text-blue-600 border border-blue-600 hover:text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
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
