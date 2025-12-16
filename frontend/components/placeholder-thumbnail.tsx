'use client';

import { Utensils } from "lucide-react";

interface PlaceholderThumbnailProps {
  className?: string;
}

export function PlaceholderThumbnail({ className = "" }: PlaceholderThumbnailProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-sky-50 to-white text-sky-500 ${className}`}
    >
      <Utensils className="w-6 h-6" />
    </div>
  );
}
