'use client';

import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useImportProgress } from "@recepify/shared/lib/use-import-progress";

interface ImportFromPinterestProps {
  onBack: () => void;
  onImport: (url: string) => Promise<void>;
}

const pinterestInitialStage = {
  progress: 12,
  message: "ChefGPT is following that pin..."
};

const pinterestProgressStages = [
  { delay: 700, progress: 34, message: "ChefGPT is opening the blog behind the pin..." },
  { delay: 1500, progress: 60, message: "ChefGPT is scraping the ingredients..." },
  { delay: 2300, progress: 83, message: "ChefGPT is formatting the steps..." },
];

export function ImportFromPinterest({ onBack, onImport }: ImportFromPinterestProps) {
  const [url, setUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { progress, message } = useImportProgress(
    isImporting,
    pinterestProgressStages,
    pinterestInitialStage
  );

  const handleImport = async () => {
    if (!url.trim()) return;

    setIsImporting(true);
    setError(null);
    try {
      await onImport(url.trim());
      setUrl("");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to import recipe");
    } finally {
      setIsImporting(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-1 -ml-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl">Import from Pinterest</h1>
        </div>
      </div>

      <div className="px-6 py-8 pb-16 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
            </svg>
          </div>
          <h2 className="text-2xl">Paste a Pinterest pin</h2>
          <p className="text-sm text-gray-600">We’ll follow the pin, grab the recipe, and save it.</p>
        </div>

        {/* URL Input */}
        <div className="space-y-4">
          <label className="block text-xs text-gray-600">Pinterest link</label>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://pin.it/... or https://pinterest.com/pin/..."
              className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 pr-20 text-sm"
              disabled={isImporting}
            />
            <button
              onClick={handlePaste}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              disabled={isImporting}
            >
              Paste
            </button>
          </div>

          <button
            onClick={handleImport}
            disabled={!url.trim() || isImporting}
            className="w-full py-3.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Importing…</span>
              </>
            ) : (
              <span>Import Recipe</span>
            )}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {isImporting && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{message || "ChefGPT is doing its magic..."}</span>
              </div>
              <div className="h-1.5 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-[width] duration-500 ease-out"
                  style={{ width: `${Math.min(95, Math.max(progress || 10, 8))}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">We’ll ping you once the recipe is ready.</p>
            </div>
          )}
        </div>

        {/* Quick Instructions */}
        <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">How to get the link</p>
          <ol className="space-y-2 text-sm text-gray-700">
            {[
              "Open the pin in Pinterest.",
              "Tap Share → Copy Link.",
              "Paste above and import."
            ].map((text, index) => (
              <li key={text} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="flex-1">{text}</span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-gray-500">
            We follow the pin to the original blog automatically—no extra steps needed.
          </p>
        </div>
      </div>
    </div>
  );
}
