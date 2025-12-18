export type SmartImportSource = "tiktok" | "pinterest" | "web" | "unknown";

export interface ImportSourceMeta {
  id: SmartImportSource;
  label: string;
  helper: string;
  accentClassName: string;
}

const SOURCE_META: Record<SmartImportSource, Omit<ImportSourceMeta, "id">> = {
  tiktok: {
    label: "TikTok",
    helper: "We’ll pull the ingredients and steps from this TikTok automatically.",
    accentClassName: "bg-gradient-to-r from-[#EE1D52] to-[#69C9D0] text-white"
  },
  pinterest: {
    label: "Pinterest",
    helper: "Pins from Pinterest and Pinimg links are fully supported.",
    accentClassName: "bg-[#E60023] text-white"
  },
  web: {
    label: "Website",
    helper: "Blogs, newsletters, and magazines work perfectly here.",
    accentClassName: "bg-gray-900 text-white"
  },
  unknown: {
    label: "Link",
    helper: "Drop a link from TikTok, Pinterest, or the web to get started.",
    accentClassName: "bg-gray-200 text-gray-700"
  }
};

const normalizeUrl = (value: string): string => {
  const url = value.trim();
  if (!url) return "";
  if (/^[a-z]+:\/\//i.test(url)) {
    return url;
  }
  return `https://${url}`;
};

const extractHostname = (value: string): string | null => {
  try {
    const url = new URL(normalizeUrl(value));
    return url.hostname.toLowerCase();
  } catch {
    return null;
  }
};

export const detectImportSource = (value: string): SmartImportSource => {
  if (!value?.trim()) {
    return "unknown";
  }
  const hostname = extractHostname(value) ?? value.toLowerCase();
  if (hostname.includes("tiktok.com")) {
    return "tiktok";
  }
  if (hostname.includes("pinterest.com") || hostname.includes("pinimg.com")) {
    return "pinterest";
  }
  if (hostname.includes(".")) {
    return "web";
  }
  return "unknown";
};

export const getImportSourceMeta = (value: string): ImportSourceMeta => {
  const id = detectImportSource(value);
  const meta = SOURCE_META[id];
  return { id, ...meta };
};
