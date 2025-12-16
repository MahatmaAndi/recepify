import type { RecipeIngredient } from "@/types/figma";

export type UnitSystem = "original" | "metric" | "us";

export const toNumber = (value: string | null): number | null => {
  if (!value) return null;
  const mixedMatch = value.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = Number.parseInt(mixedMatch[1], 10);
    const numerator = Number.parseInt(mixedMatch[2], 10);
    const denominator = Number.parseInt(mixedMatch[3], 10);
    if (!Number.isNaN(whole) && !Number.isNaN(numerator) && denominator) {
      return whole + numerator / denominator;
    }
  }
  const fractionMatch = value.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const numerator = Number.parseInt(fractionMatch[1], 10);
    const denominator = Number.parseInt(fractionMatch[2], 10);
    if (!Number.isNaN(numerator) && denominator) {
      return numerator / denominator;
    }
  }
  const normalized = value.replace(",", ".").trim();
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};

export const formatNumber = (value: number): string => {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return value.toFixed(2).replace(/\.?0+$/, "");
};

const UNIT_DEFINITIONS = {
  gram: { type: "mass", toBase: 1 },
  kilogram: { type: "mass", toBase: 1000 },
  milligram: { type: "mass", toBase: 0.001 },
  ounce: { type: "mass", toBase: 28.3495 },
  pound: { type: "mass", toBase: 453.592 },
  milliliter: { type: "volume", toBase: 1 },
  liter: { type: "volume", toBase: 1000 },
  teaspoon: { type: "volume", toBase: 5 },
  tablespoon: { type: "volume", toBase: 15 },
  cup: { type: "volume", toBase: 240 },
  pint: { type: "volume", toBase: 473 },
  quart: { type: "volume", toBase: 946 },
  gallon: { type: "volume", toBase: 3785 },
  fluidOunce: { type: "volume", toBase: 30 },
} as const;

type UnitKey = keyof typeof UNIT_DEFINITIONS;

const UNIT_ALIASES: Record<string, UnitKey> = {
  g: "gram",
  gram: "gram",
  grams: "gram",
  kilogram: "kilogram",
  kilograms: "kilogram",
  kg: "kilogram",
  kgs: "kilogram",
  mg: "milligram",
  milligram: "milligram",
  milligrams: "milligram",
  ounce: "ounce",
  ounces: "ounce",
  oz: "ounce",
  lb: "pound",
  lbs: "pound",
  pound: "pound",
  pounds: "pound",
  ml: "milliliter",
  milliliter: "milliliter",
  milliliters: "milliliter",
  liter: "liter",
  liters: "liter",
  litre: "liter",
  litres: "liter",
  l: "liter",
  tsp: "teaspoon",
  tsps: "teaspoon",
  teaspoon: "teaspoon",
  teaspoons: "teaspoon",
  tbsp: "tablespoon",
  tbsps: "tablespoon",
  tablespoon: "tablespoon",
  tablespoons: "tablespoon",
  cup: "cup",
  cups: "cup",
  pint: "pint",
  pints: "pint",
  pt: "pint",
  pts: "pint",
  quart: "quart",
  quarts: "quart",
  qt: "quart",
  qts: "quart",
  gallon: "gallon",
  gallons: "gallon",
  gal: "gallon",
  "fluid ounce": "fluidOunce",
  "fluid ounces": "fluidOunce",
  "fl oz": "fluidOunce",
  floz: "fluidOunce",
};

interface ParsedAmount {
  quantity: number;
  unitKey: UnitKey;
  remainder: string;
}

const normalizeUnitKey = (unit: string): UnitKey | null => {
  const normalized = unit.toLowerCase().replace(/\./g, "").trim().replace(/\s+/g, " ");
  const alias = UNIT_ALIASES[normalized];
  if (alias) {
    return alias;
  }
  const compact = normalized.replace(/\s+/g, "");
  return UNIT_ALIASES[compact] ?? null;
};

const parseAmountWithUnit = (amount: string): ParsedAmount | null => {
  const trimmed = amount.trim();
  if (!trimmed) {
    return null;
  }
  const withoutParentheses = trimmed.replace(/\([^)]*\)/g, "").trim();
  const normalized = withoutParentheses.replace(/[–—]/g, "-");

  const directMatch = normalized.match(/^([\d\s./-]+)\s*([a-zA-Z]+(?:\s?[a-zA-Z]+)?)(.*)$/);
  if (directMatch) {
    const quantity = toNumber(directMatch[1]);
    if (quantity !== null) {
      const unitKey = normalizeUnitKey(directMatch[2]);
      if (unitKey) {
        const remainder = directMatch[3]?.trim() ?? "";
        return { quantity, unitKey, remainder };
      }
    }
  }

  const compactMatch = normalized.match(/^([\d./-]+)([a-zA-Z]+)(.*)$/);
  if (compactMatch) {
    const quantity = toNumber(compactMatch[1].replace(/-/g, " "));
    if (quantity !== null) {
      const unitKey = normalizeUnitKey(compactMatch[2]);
      if (unitKey) {
        const remainder = compactMatch[3]?.trim() ?? "";
        return { quantity, unitKey, remainder };
      }
    }
  }

  const tokens = normalized.split(/\s+/);
  if (tokens.length >= 2) {
    const quantity = toNumber(tokens[0]);
    const unitKey = normalizeUnitKey(tokens[1]);
    if (quantity !== null && unitKey) {
      const remainder = tokens.slice(2).join(" ").trim();
      return { quantity, unitKey, remainder };
    }
  }
  return null;
};

const chooseMetricMassUnit = (grams: number) => {
  if (grams >= 1000) {
    return { value: grams / 1000, unit: "kg" };
  }
  return { value: grams, unit: "g" };
};

const chooseMetricVolumeUnit = (milliliters: number) => {
  if (milliliters >= 1000) {
    return { value: milliliters / 1000, unit: "l" };
  }
  return { value: milliliters, unit: "ml" };
};

const chooseUSMassUnit = (grams: number) => {
  if (grams >= 453.592) {
    return { value: grams / 453.592, unit: "lb" };
  }
  return { value: grams / 28.3495, unit: "oz" };
};

const US_VOLUME_UNITS = [
  { unit: "gal", size: 3785 },
  { unit: "qt", size: 946 },
  { unit: "pt", size: 473 },
  { unit: "cup", size: 240 },
  { unit: "tbsp", size: 15 },
  { unit: "tsp", size: 5 },
];

const chooseUSVolumeUnit = (milliliters: number) => {
  for (const candidate of US_VOLUME_UNITS) {
    if (milliliters >= candidate.size - 0.01) {
      return { value: milliliters / candidate.size, unit: candidate.unit };
    }
  }
  return { value: milliliters / 5, unit: "tsp" };
};

export interface ConversionResult {
  value: number;
  formattedValue: string;
  unit: string;
  remainder: string;
}

export const convertMeasurement = (value: string, target: UnitSystem): ConversionResult | null => {
  if (!value || target === "original") {
    return null;
  }
  const parsed = parseAmountWithUnit(value);
  if (!parsed) {
    return null;
  }
  const definition = UNIT_DEFINITIONS[parsed.unitKey];
  if (!definition) {
    return null;
  }
  const baseValue = parsed.quantity * definition.toBase;
  let convertedValue: number;
  let unitLabel: string;
  if (target === "metric") {
    if (definition.type === "mass") {
      ({ value: convertedValue, unit: unitLabel } = chooseMetricMassUnit(baseValue));
    } else {
      ({ value: convertedValue, unit: unitLabel } = chooseMetricVolumeUnit(baseValue));
    }
  } else {
    if (definition.type === "mass") {
      ({ value: convertedValue, unit: unitLabel } = chooseUSMassUnit(baseValue));
    } else {
      ({ value: convertedValue, unit: unitLabel } = chooseUSVolumeUnit(baseValue));
    }
  }
  const formattedValue = formatNumber(convertedValue);
  return { value: convertedValue, formattedValue, unit: unitLabel, remainder: parsed.remainder };
};

export const convertAmountToSystem = (
  amount: string | undefined,
  target: UnitSystem
): string | null => {
  if (!amount) {
    return null;
  }
  const converted = convertMeasurement(amount, target);
  if (!converted) {
    return null;
  }
  const assembled = `${converted.formattedValue} ${converted.unit}`.trim();
  return converted.remainder ? `${assembled} ${converted.remainder}` : assembled;
};

export const convertIngredientsToSystem = (
  ingredients: RecipeIngredient[],
  target: UnitSystem
): RecipeIngredient[] => {
  if (target === "original") {
    return ingredients;
  }
  return ingredients.map((ingredient) => {
    if (!ingredient.amount) {
      return ingredient;
    }
    const converted = convertAmountToSystem(ingredient.amount, target);
    if (!converted) {
      return ingredient;
    }
    return { ...ingredient, amount: converted };
  });
};

export const UNIT_SYSTEM_OPTIONS: { value: UnitSystem; label: string }[] = [
  { value: "original", label: "Original" },
  { value: "metric", label: "Metric" },
  { value: "us", label: "US" },
];
