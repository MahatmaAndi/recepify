'use client';

import { Camera, Inbox, Link2, Plus } from "lucide-react";
import type { Screen } from "@recepify/shared/types/figma";

interface ImportQuickActionsProps {
  onNavigate: (screen: Screen) => void;
  onAddManually: () => void;
  inboxCount?: number;
}

interface QuickAction {
  id: Screen | "manual" | "inbox";
  label: string;
  icon: React.ElementType;
}

const ACTIONS: QuickAction[] = [
  { id: "importFromLink", label: "From Link", icon: Link2 },
  { id: "scanRecipe", label: "Scan", icon: Camera },
  { id: "manual", label: "Manual", icon: Plus },
  { id: "inbox", label: "Inbox", icon: Inbox },
];

export function ImportQuickActions({
  onNavigate,
  onAddManually,
  inboxCount = 0,
}: ImportQuickActionsProps) {
  const handleAction = (actionId: QuickAction["id"]) => {
    if (actionId === "manual") {
      onAddManually();
      return;
    }
    if (actionId === "inbox") {
      onNavigate("importInbox");
      return;
    }
    onNavigate(actionId);
  };

  return (
    <div className="px-6">
      <div className="rounded-[26px] border border-gray-200 bg-white/90 p-5 shadow-sm">
        <p className="mb-4 text-sm font-medium text-gray-800">Add Recipe</p>
        <div className="flex items-center justify-between gap-3">
          {ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className="flex flex-col items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-sm">
                <action.icon className="h-5 w-5" />
                {action.id === "inbox" && inboxCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-medium text-white">
                    {inboxCount}
                  </span>
                )}
              </div>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
