'use client';

import { ArrowLeft, Copy, Check, Loader2, Instagram } from "lucide-react";
import { useState } from "react";
import { useImportProgress } from "@/lib/use-import-progress";

interface ImportFromInstagramProps {
  onBack: () => void;
  onImport: (url: string) => Promise<void>;
}

const instagramInitialStage = {
  progress: 14,
  message: "ChefGPT is checking that Instagram link..."
};

const instagramProgressStages = [
  { delay: 800, progress: 33, message: "ChefGPT is downloading the reel..." },
  { delay: 1600, progress: 58, message: "ChefGPT is transcribing the audio..." },
  { delay: 2400, progress: 82, message: "ChefGPT is organizing the recipe..." },
];

export function ImportFromInstagram({ onBack, onImport }: ImportFromInstagramProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { progress, message } = useImportProgress(
    isImporting,
    instagramProgressStages,
    instagramInitialStage
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

  const handleCopyInstructions = () => {
    navigator.clipboard.writeText(
      "Open Instagram → Find the recipe reel/post → Tap Share → Copy Link → Return to Recipefy → Paste link"
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-1 -ml-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl">Import from Instagram</h1>
        </div>
      </div>

      <div className="px-6 py-8 pb-16 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-black flex items-center justify-center text-white">
            <Instagram className="w-7 h-7" />
          </div>
          <h2 className="text-2xl">Paste your Instagram link</h2>
          <p className="text-sm text-gray-600">
            We’ll download the video, transcribe the audio, and turn it into a recipe automatically.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-xs text-gray-600">Instagram reel or post URL</label>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://www.instagram.com/reel/..."
              className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-sm pr-20"
              disabled={isImporting}
            />
            <button
              onClick={handleCopyInstructions}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              {copied ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Steps
                </span>
              )}
            </button>
          </div>

          <button
            onClick={handleImport}
            disabled={!url.trim() || isImporting}
            className="w-full py-3.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
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
              <p className="text-xs text-gray-500">ChefGPT will drop you into the recipe when it’s ready.</p>
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">How to get the link</p>
          <ol className="space-y-2 text-sm text-gray-700">
            {[
              "Open Instagram and find the recipe reel/post.",
              "Tap the Share icon → Copy Link.",
              "Paste above and tap Import.",
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
            Works with reels and feed videos. Private profiles aren’t supported yet.
          </p>
        </div>
      </div>
    </div>
  );
}
