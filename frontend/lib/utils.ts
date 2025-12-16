import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RecipeIngredient } from "@/types/figma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();
  const colonMatch = normalized.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
  const getParts = (hours: number, minutes: number, seconds: number) => {
    const components: string[] = [];
    if (hours) components.push(`${hours} h`);
    if (minutes) components.push(`${minutes} min`);
    if (seconds) components.push(`${seconds} s`);
    return components;
  };

  if (colonMatch) {
    const hours = Number(colonMatch[1]);
    const minutes = Number(colonMatch[2]);
    const seconds = colonMatch[3] ? Number(colonMatch[3]) : 0;
    const parts = getParts(hours, minutes, seconds);
    return parts.length ? parts.join(" ") : normalized;
  }

  const hoursMatch = normalized.match(/(\d+)H/i);
  const minutesMatch = normalized.match(/(\d+)M/i);
  const secondsMatch = normalized.match(/(\d+)S/i);
  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;
  const seconds = secondsMatch ? Number(secondsMatch[1]) : 0;

  if (!hours && !minutes && !seconds) {
    return normalized;
  }

  const parts = getParts(hours, minutes, seconds);
  return parts.join(" ");
}

export function getFriendlyDuration(...values: Array<string | null | undefined>): string | undefined {
  for (const value of values) {
    if (!value) {
      continue;
    }
    const friendly = formatDuration(value);
    if (friendly) {
      return friendly;
    }
  }
  return undefined;
}

interface FormatIngredientOptions {
  includeAmount?: boolean;
  includeName?: boolean;
  fallbackToLine?: boolean;
}

export function formatIngredientText(
  ingredient: RecipeIngredient,
  options: FormatIngredientOptions = {}
): string {
  const { includeAmount = true, includeName = true, fallbackToLine = true } = options;

  const amount = includeAmount ? ingredient.amount?.trim() : undefined;
  const name = includeName ? ingredient.name?.trim() : undefined;
  const pieces = [amount, name].filter((value) => Boolean(value && value.length)) as string[];

  if (pieces.length) {
    return pieces.join(" ").trim();
  }

  if (fallbackToLine) {
    return ingredient.line?.trim() ?? "";
  }

  return "";
}

export function hasIngredientContent(ingredient: RecipeIngredient): boolean {
  return Boolean(
    ingredient.amount?.trim() || ingredient.name?.trim() || ingredient.line?.trim()?.length
  );
}

const QUANTITY_TOKEN_REGEX = /^(?:\d+(?:[.,]\d+)?|\d+\/\d+|\d+\s+\d+\/\d+|\d+[–-]\d+|[¼½¾⅓⅔⅛⅜⅝⅞])$/;

const UNIT_TOKENS = new Set(
  [
    "tsp",
    "tsps",
    "teaspoon",
    "teaspoons",
    "tbsp",
    "tbsps",
    "tablespoon",
    "tablespoons",
    "cup",
    "cups",
    "g",
    "gram",
    "grams",
    "gramm",
    "gramme",
    "kg",
    "kilogram",
    "kilograms",
    "ml",
    "milliliter",
    "milliliters",
    "l",
    "liter",
    "liters",
    "dl",
    "cl",
    "oz",
    "ounce",
    "ounces",
    "lb",
    "lbs",
    "pound",
    "pounds",
    "stick",
    "sticks",
    "slice",
    "slices",
    "pinch",
    "pinches",
    "dash",
    "dashes",
    "can",
    "cans",
    "dose",
    "dosen",
    "el",
    "esslöffel",
    "tl",
    "teelöffel",
    "prise",
    "prisen",
    "stück",
    "stücke",
    "bund",
    "becher",
    "scheibe",
    "scheiben",
    "zweig",
    "zweige",
    "spritzer",
    "päckchen",
    "päckchen",
    "packung",
    "packungen",
    "tasse",
    "tassen",
    "liter",
    "portion",
    "portionen",
  ].map((token) => token.toLowerCase())
);

const CONNECTOR_TOKENS = new Set(
  ["-", "–", "bis", "to", "und", "oder", "plus", "about", "approx", "approx.", "ca", "ca.", "circa"]
);

const ALLOWED_LEADING_WORDS = new Set(["a", "an", "one", "half", "halbe", "halber", "pinch", "prise"]);

const cleanToken = (token: string) => token.replace(/[,:;]+$/, "").toLowerCase();

const isQuantityToken = (token: string) => QUANTITY_TOKEN_REGEX.test(token);

const isUnitToken = (token: string) => UNIT_TOKENS.has(token);

const isConnectorToken = (token: string) => CONNECTOR_TOKENS.has(token);

export const splitIngredientLine = (
  rawLine?: string | null
): { amount?: string; name?: string } => {
  if (!rawLine) {
    return {};
  }

  const normalized = rawLine.trim();
  if (!normalized) {
    return {};
  }

  const tokens = normalized.split(/\s+/);
  const amountTokens: string[] = [];
  for (const token of tokens) {
    const cleaned = cleanToken(token);
    const isLeading = amountTokens.length === 0;
    if (
      isQuantityToken(cleaned) ||
      isUnitToken(cleaned) ||
      (!cleaned && token.trim() === "") ||
      isConnectorToken(cleaned) ||
      (isLeading && ALLOWED_LEADING_WORDS.has(cleaned))
    ) {
      amountTokens.push(token);
      continue;
    }
    break;
  }

  const amount = amountTokens.join(" ").trim();
  if (!amount) {
    return { name: normalized };
  }

  const nameTokens = tokens.slice(amountTokens.length);
  const name = nameTokens.join(" ").trim().replace(/^[-,]/, "").trim();
  return {
    amount,
    name: name || undefined,
  };
};
