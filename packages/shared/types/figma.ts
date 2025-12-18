export type RecipeSource = "tiktok" | "instagram" | "pinterest" | "web" | "voice" | "scan";

export type RecipeDifficulty = "easy" | "medium" | "hard";

export interface RecipeNutrition {
  calories?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
}

export interface RecipeIngredient {
  id?: string;
  line?: string;
  amount?: string;
  name?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  duration?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: number;
  difficulty?: RecipeDifficulty;
  category?: string;
  source?: RecipeSource;
  sourceUrl?: string;
  sourceDomain?: string;
  tags?: string[];
  isFavorite?: boolean;
  ingredients: RecipeIngredient[];
  steps: string[];
  notes?: string;
  nutrition?: RecipeNutrition;
  importedAt?: string;
}

export type Screen =
  | "home"
  | "import"
  | "importFromLink"
  | "scanRecipe"
  | "importFromTikTok"
  | "importFromInstagram"
  | "importFromPinterest"
  | "recordVoiceRecipe"
  | "importInbox"
  | "myRecipes"
  | "profile"
  | "recipeDetail"
  | "recipeEdit"
  | "cookMode"
  | "shoppingList";

export type SocialPlatform = "tiktok" | "instagram" | "pinterest";

export interface ImportItem {
  id: string;
  title: string;
  platform: SocialPlatform | "web";
  status: "processing" | "ready" | "needsConnection" | "failed";
  timestamp: Date;
  thumbnail?: string;
  recipeId?: string;
  progress?: number;
  progressMessage?: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount?: string;
  isChecked: boolean;
  recipeId?: string;
  recipeName?: string;
}
