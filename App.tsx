
import React, { useState, FormEvent } from 'react';
import { generateThumbnail } from './services/geminiService';
import Spinner from './components/Spinner';

const MagicWandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.22 2.23a1 1 0 0 0-1.04 0l-1.64 1.1a1 1 0 0 1-1.08 0L8.82 2.23a1 1 0 0 0-1.04 0L6.14 3.33a1 1 0 0 1-1.08 0L3.42 2.23a1 1 0 0 0-1.04 0L1.29 2.8a1 1 0 0 0-.29.71v10.98a1 1 0 0 0 .29.71l1.09.57a1 1 0 0 0 1.04 0l1.64-1.1a1 1 0 0 1 1.08 0l1.64 1.1a1 1 0 0 0 1.04 0l1.64-1.1a1 1 0 0 1 1.08 0l1.64 1.1a1 1 0 0 0 1.04 0l1.09-.57a1 1 0 0 0 .29-.71V3.5a1 1 0 0 0-.29-.71l-1.09-.57zM19 12.25a1 1 0 0 0-1.06-.99l-2.42.34a1 1 0 0 1-1.12-1.12l.34-2.42a1 1 0 0 0-.99-1.06c-1.12-.13-2.18-.55-3.1-1.14a1 1 0 0 0-1.28 1.28c.59.92 1.01 1.98 1.14 3.1a1 1 0 0 0 1.06.99l2.42-.34a1 1 0 0 1 1.12 1.12l-.34 2.42a1 1 0 0 0 .99 1.06c1.12.13 2.18.55 3.1 1.14a1 1 0 0 0 1.28-1.28c-.59-.92-1.01-1.98-1.14-3.1zM11 15.5l-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1.5-1.5 1-1 1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1 1.5 1.5-1 1-1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1-1.5 1.5z" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 12.59l3.29-3.3a1 1 0 1 1 1.42 1.42l-4 4A1 1 0 0 1 12 15z" />
    <path d="M12 2a1 1 0 0 0-1 1v10a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1z" />
    <path d="M18 10a1 1 0 0 0-1 1v7H7v-7a1 1 0 0 0-2 0v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a1 1 0 0 0-1-1z" />
  </svg>
);

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageB64 = await generateThumbnail(prompt);
      setGeneratedImage(imageB64);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center my-8 md:my-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            AI Thumbnail Generator
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Craft ultra-realistic, high-quality 16:9 thumbnails from a simple text prompt.
          </p>
        </header>

        <main className="w-full">
          <form onSubmit={handleGenerate} className="bg-slate-800/50 p-6 rounded-2xl shadow-2xl shadow-black/20 border border-slate-700">
            <label htmlFor="prompt-input" className="block text-lg font-semibold text-slate-200 mb-3">
              Enter Your Prompt
            </label>
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A majestic lion wearing a golden crown, sitting on a throne in a futuristic city"
              className="w-full h-28 p-4 bg-slate-900 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 ease-in-out resize-none text-slate-100 placeholder-slate-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="mt-5 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-400"
            >
              <MagicWandIcon className="h-5 w-5" />
              {isLoading ? 'Generating...' : 'Generate Thumbnail'}
            </button>
          </form>

          <div className="mt-10 min-h-[300px]">
            {isLoading && <Spinner />}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
                <p className="font-semibold">Generation Failed</p>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            )}
            {generatedImage && !isLoading && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-center mb-4">Your Generated Thumbnail</h2>
                <div className="bg-slate-800 p-2 rounded-lg shadow-lg">
                   <img
                    src={`data:image/jpeg;base64,${generatedImage}`}
                    alt="Generated thumbnail"
                    className="w-full aspect-video rounded-md object-cover"
                   />
                </div>
                <a
                  href={`data:image/jpeg;base64,${generatedImage}`}
                  download="ai-thumbnail.jpeg"
                  className="mt-6 w-full max-w-xs mx-auto flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-300"
                >
                  <DownloadIcon className="h-5 w-5" />
                  Download Image
                </a>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

// Simple fade-in animation using Tailwind config in a style tag,
// as we can't create separate CSS files.
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
