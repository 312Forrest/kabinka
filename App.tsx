import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { generateImage } from './services/geminiService';
import { fileToGenerativePart } from './utils/fileUtils';
import { LoadingSpinner, MagicWandIcon } from './components/icons';

interface ImageData {
  file: File;
  preview: string;
}

const App: React.FC = () => {
  const [selfie, setSelfie] = useState<ImageData | null>(null);
  const [clothing, setClothing] = useState<ImageData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastOperationWasEdit, setLastOperationWasEdit] = useState<boolean>(false);

  const handleGenerate = useCallback(async () => {
    if (!selfie || !clothing) {
      setError('Prosím, nahrajte selfie i obrázek oblečení.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setLastOperationWasEdit(false);

    try {
      const selfiePart = await fileToGenerativePart(selfie.file);
      const clothingPart = await fileToGenerativePart(clothing.file);
      const textPart = { text: 'Using the person from the first image (the selfie) and the clothing item from the second image, generate a new, realistic image of the person wearing that clothing. The person should maintain their original appearance (face, body shape). Place them against a neutral studio background.' };
      
      const result = await generateImage([selfiePart, clothingPart, textPart]);
      setGeneratedImage(`data:image/png;base64,${result}`);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Nepodařilo se vygenerovat obrázek. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  }, [selfie, clothing]);

  const handleEdit = useCallback(async () => {
    if (!generatedImage || !editPrompt) {
      setError('Nejprve prosím vygenerujte obrázek a zadejte pokyn pro úpravu.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setLastOperationWasEdit(true);

    try {
      // Convert base64 string to a Part
      const base64Data = generatedImage.split(',')[1];
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: 'image/png'
        }
      };
      const textPart = { text: editPrompt };

      const result = await generateImage([imagePart, textPart]);
      setGeneratedImage(`data:image/png;base64,${result}`);
      setEditPrompt('');
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Nepodařilo se upravit obrázek. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  }, [generatedImage, editPrompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Virtuální zkušební kabinka
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            Vyzkoušejte si nové oblečení okamžitě s pomocí AI.
          </p>
        </header>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Inputs */}
          <div className="lg:col-span-1 space-y-8">
            <ImageUploader 
              id="selfie-uploader"
              label="1. Nahrajte své selfie"
              onImageUpload={(file, preview) => setSelfie({ file, preview })}
              previewUrl={selfie?.preview}
            />
            <ImageUploader 
              id="clothing-uploader"
              label="2. Nahrajte oblečení"
              onImageUpload={(file, preview) => setClothing({ file, preview })}
              previewUrl={clothing?.preview}
            />
          </div>

          {/* Actions & Result */}
          <div className="lg:col-span-2 bg-gray-800/50 rounded-2xl p-6 shadow-2xl shadow-purple-900/20 border border-gray-700">
            <div className="flex flex-col items-center">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !selfie || !clothing}
                className="w-full max-w-sm flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full transition-all duration-300 ease-in-out hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg shadow-purple-500/30"
              >
                {isLoading && !lastOperationWasEdit ? <LoadingSpinner /> : <MagicWandIcon />}
                <span>Vygenerovat váš vzhled</span>
              </button>
              
              <div className="w-full mt-8 min-h-[400px] bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700 overflow-hidden">
                {isLoading && (
                  <div className="flex flex-col items-center text-gray-400">
                    <LoadingSpinner className="w-12 h-12 mb-4" />
                    <p className="text-lg animate-pulse">
                      {lastOperationWasEdit ? 'Vylepšuji váš obrázek...' : 'Generuji váš nový vzhled...'}
                    </p>
                    <p className="text-sm">Může to chvíli trvat.</p>
                  </div>
                )}
                {!isLoading && generatedImage && (
                  <img src={generatedImage} alt="Vygenerovaný model" className="object-contain max-w-full max-h-full" />
                )}
                {!isLoading && !generatedImage && (
                  <div className="text-center text-gray-500 p-8">
                    <p className="text-xl font-medium">Váš vygenerovaný obrázek se zobrazí zde.</p>
                    <p>Nahrajte oba obrázky a klikněte na "Vygenerovat váš vzhled" pro spuštění.</p>
                  </div>
                )}
              </div>

              {generatedImage && !isLoading && (
                <div className="w-full mt-6 space-y-4">
                   <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-300">3. Upravte obrázek (volitelné)</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      id="edit-prompt"
                      type="text"
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="např. 'Změň pozadí na pláž' nebo 'Změň barvu trička na modrou'"
                      className="flex-grow bg-gray-900 border border-gray-700 text-white rounded-full px-5 py-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                    />
                    <button
                      onClick={handleEdit}
                      disabled={isLoading || !editPrompt}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading && lastOperationWasEdit ? <LoadingSpinner /> : '✨'}
                      <span>Upravit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;