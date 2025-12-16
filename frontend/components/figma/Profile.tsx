'use client';

import { type FormEvent, useEffect, useState } from "react";
import { User, Settings, HelpCircle, LogOut, ChevronRight, Globe, Ruler, X } from "lucide-react";

import { getUserSettings, updateUserSettings, type UnitPreference } from "@/lib/api";

type StatusMessage = {
  type: "success" | "error";
  text: string;
};

const inputClasses =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40";

interface ProfileProps {
  name: string;
  onNameChange: (value: string) => void;
}

export function Profile({ name, onNameChange }: ProfileProps) {
  const [email, setEmail] = useState("andi@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [preferredUnits, setPreferredUnits] = useState<UnitPreference>("metric");
  const [country, setCountry] = useState("Germany");
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const preferenceControlsDisabled = isLoadingPreferences || isSavingPreferences;

  useEffect(() => {
    let cancelled = false;
    async function loadSettings() {
      try {
        const settings = await getUserSettings();
        if (cancelled) {
          return;
        }
        setPreferredUnits(settings.unitPreference ?? "metric");
        setCountry(settings.country ?? "Germany");
      } catch (error) {
        console.error("Failed to load preferences", error);
        if (!cancelled) {
          setStatusMessage({
            type: "error",
            text: "We couldn't load your preferences. Using defaults for now.",
          });
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPreferences(false);
        }
      }
    }
    loadSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    try {
      const updated = await updateUserSettings({
        country,
        unitPreference: preferredUnits,
      });
      setPreferredUnits(updated.unitPreference);
      setCountry(updated.country ?? country);
      setStatusMessage({ type: "success", text: "Preferences saved." });
      setIsPreferencesOpen(false);
    } catch (error) {
      console.error("Failed to save preferences", error);
      setStatusMessage({
        type: "error",
        text: "We couldn't save your preferences. Please try again.",
      });
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage({ type: "success", text: "Name and email have been saved." });
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatusMessage({ type: "error", text: "Please fill in all password fields." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: "error", text: "The new passwords do not match." });
      return;
    }
    setStatusMessage({ type: "success", text: "Password updated successfully." });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-16 pb-8 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h1 className="text-xl mb-0.5">{name}</h1>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>
      </div>

      {/* Account Forms */}
      <div className="px-6 py-6 space-y-6">
        <section className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-gray-500">Account</p>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <label className="text-sm font-medium text-gray-700">
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                className={`${inputClasses} mt-1`}
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`${inputClasses} mt-1`}
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-900"
            >
              Save changes
            </button>
          </form>
        </section>

        <section className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-gray-500">Password</p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <label className="text-sm font-medium text-gray-700">
              Current password
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className={`${inputClasses} mt-1`}
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              New password
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className={`${inputClasses} mt-1`}
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Confirm new password
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={`${inputClasses} mt-1`}
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-900"
            >
              Update password
            </button>
          </form>
        </section>

        {statusMessage && (
          <div
            className={`rounded-lg px-4 py-2 text-sm ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </div>

      {/* Settings Menu */}
      <div className="px-6 py-6 border-t border-gray-200">
        <div className="space-y-1">
          <MenuButton icon={Settings} label="Preferences" onClick={() => setIsPreferencesOpen(true)} />
          <MenuButton icon={HelpCircle} label="Help & Support" onClick={() => setIsSupportOpen(true)} />
          <MenuButton icon={LogOut} label="Log Out" onClick={() => {}} destructive />
        </div>
      </div>

      {/* App Info */}
      <div className="px-6 py-6 text-center text-xs text-gray-400">
        <p>Recipefy v1.0.0</p>
      </div>

      {isPreferencesOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500" />
                <h2 className="text-base font-medium">Preferences</h2>
              </div>
              <button
                onClick={() => setIsPreferencesOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-6">
              {isLoadingPreferences && (
                <p className="text-xs text-gray-500">Loading your saved preferences...</p>
              )}
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">Default units</p>
                <div className="flex gap-2">
                  {["metric", "us"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      disabled={preferenceControlsDisabled}
                      onClick={() => setPreferredUnits(option as UnitPreference)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm flex items-center justify-center gap-2 transition ${
                        preferredUnits === option
                          ? "border-black text-black"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      } ${preferenceControlsDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      {option === "metric" ? "Metric" : "US"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">Country</p>
                <div className="relative">
                  <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={country}
                    disabled={preferenceControlsDisabled}
                    onChange={(event) => setCountry(event.target.value)}
                    className={`w-full appearance-none rounded-lg border border-gray-200 pl-9 pr-10 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black/20 ${
                      preferenceControlsDisabled ? "bg-gray-50 text-gray-500" : ""
                    }`}
                  >
                    {["Germany", "Austria", "Switzerland", "United States", "United Kingdom"].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                </div>
              </div>
              <button
                onClick={handleSavePreferences}
                disabled={isSavingPreferences}
                className={`w-full rounded-lg bg-black text-white text-sm font-medium py-2.5 transition ${
                  isSavingPreferences ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSavingPreferences ? "Saving..." : "Save preferences"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSupportOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gray-500" />
                <h2 className="text-base font-medium">Help & Support</h2>
              </div>
              <button
                onClick={() => setIsSupportOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-sm text-gray-700">
              <p className="text-sm text-gray-600">
                Need a hand? Check the quick links below or drop us a note with your feedback.
              </p>
              <div className="space-y-2">
                <SupportLink label="Import troubleshooting guide" href="#" />
                <SupportLink label="FAQ: ChefGPT & translations" href="#" />
                <SupportLink label="Submit feedback or feature idea" href="#" />
              </div>
              <div className="rounded-xl border border-gray-200 p-4 text-xs text-gray-600 space-y-2">
                <p className="font-semibold text-gray-900">Contact us</p>
                <p>support@recipefy.app</p>
                <p>Mon–Fri, 9am–6pm CET</p>
              </div>
              <button
                onClick={() => {
                  setIsSupportOpen(false);
                  setStatusMessage({ type: "success", text: "Thanks! We'll get back to you soon." });
                }}
                className="w-full rounded-lg bg-gray-900 text-white py-2.5 text-sm font-medium"
              >
                Send feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MenuButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

function MenuButton({ icon: Icon, label, onClick, destructive }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-lg p-3 text-sm transition hover:bg-gray-50 ${
        destructive ? "text-red-600" : "text-gray-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </button>
  );
}

interface SupportLinkProps {
  label: string;
  href: string;
}

function SupportLink({ label, href }: SupportLinkProps) {
  return (
    <a
      href={href}
      className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
    >
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </a>
  );
}
