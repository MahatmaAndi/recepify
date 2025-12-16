'use client';

import NextImage from "next/image";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Link2 } from "lucide-react";
import type { ImportItem } from "@/types/figma";

interface ImportInboxProps {
  items: ImportItem[];
  onBack: () => void;
  onAction: (itemId: string, action: "open" | "connect" | "retry" | "delete") => void;
}

export function ImportInbox({ items, onBack, onAction }: ImportInboxProps) {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 -ml-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl">Imports</h1>
          </div>
        </div>
      </div>

      {/* Import List */}
      <div className="px-6 py-6">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-7 h-7 text-gray-400" />
            </div>
            <h2 className="text-xl mb-2">No imports yet</h2>
            <p className="text-gray-500 text-sm mb-6">
              Share a recipe from TikTok or paste a URL
            </p>
            <button
              onClick={onBack}
              className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              Import recipe
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <ImportItemCard
                key={item.id}
                item={item}
                timeAgo={getTimeAgo(item.timestamp)}
                onAction={(action) => onAction(item.id, action)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ImportItemCardProps {
  item: ImportItem;
  timeAgo: string;
  onAction: (action: "open" | "connect" | "retry" | "delete") => void;
}

function ImportItemCard({ item, timeAgo, onAction }: ImportItemCardProps) {
  const progressValue =
    typeof item.progress === "number"
      ? Math.min(100, Math.max(5, Math.round(item.progress)))
      : undefined;

  const getPlatformIcon = () => {
    const iconClass = "w-4 h-4";
    switch (item.platform) {
      case "tiktok":
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none">
            <path
              d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"
              fill="currentColor"
            />
          </svg>
        );
      case "instagram":
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
          </svg>
        );
      case "pinterest":
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
          </svg>
        );
      default:
        return <Link2 className={iconClass} />;
    }
  };

  const getStatusDisplay = () => {
    switch (item.status) {
      case "processing":
        return (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Processing</span>
          </div>
        );
      case "ready":
        return (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CheckCircle className="w-3 h-3" />
            <span>Ready</span>
          </div>
        );
      case "needsConnection":
        return (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <AlertCircle className="w-3 h-3" />
            <span>Connect account</span>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-3 h-3" />
            <span>Failed</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all">
      <div className="flex gap-3">
        {/* Thumbnail */}
        {item.thumbnail && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <NextImage
              fill
              sizes="64px"
              src={item.thumbnail}
              alt={item.title}
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-gray-600">
              {getPlatformIcon()}
              <h3 className="text-sm line-clamp-1">{item.title}</h3>
            </div>
          </div>

          <div className="mb-2">
            {getStatusDisplay()}
          </div>

          <p className="text-xs text-gray-400 mb-3">{timeAgo}</p>

          {/* Actions based on status */}
          <div className="space-y-2">
            {item.status === "processing" && (
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>{item.progressMessage ?? "Processing recipe..."}</span>
                  {typeof progressValue === "number" && (
                    <span>{progressValue}%</span>
                  )}
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-[width] duration-500 ease-out"
                    style={{ width: `${progressValue ?? 15}%` }}
                  />
                </div>
              </div>
            )}

            {item.status === "ready" && (
              <div className="flex gap-2">
                <button
                  onClick={() => onAction("open")}
                  className="px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs"
                >
                  Open recipe
                </button>
              </div>
            )}

            {item.status === "needsConnection" && (
              <div className="flex gap-2">
                <button
                  onClick={() => onAction("connect")}
                  className="px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs"
                >
                  Connect {item.platform}
                </button>
                <button
                  onClick={() => onAction("delete")}
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs"
                >
                  Delete
                </button>
              </div>
            )}

            {item.status === "failed" && (
              <div className="flex gap-2">
                <button
                  onClick={() => onAction("retry")}
                  className="px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs"
                >
                  Retry
                </button>
                <button
                  onClick={() => onAction("delete")}
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
