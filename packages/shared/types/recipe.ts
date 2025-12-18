export interface Ingredient {
  id: string;
  line: string;
  amount?: string | null;
  name?: string | null;
}

export interface InstructionStep {
  id: string;
  stepNumber: number;
  text: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string | null;
  mealType?: string | null;
  difficulty?: string | null;
  prepTime?: string | null;
  cookTime?: string | null;
  totalTime?: string | null;
  servings?: string | null;
  nutritionCalories?: string | null;
  nutritionProtein?: string | null;
  nutritionCarbs?: string | null;
  nutritionFat?: string | null;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  tags: string[];
  chefNotes?: string | null;
  sourcePlatform: "web" | "tiktok" | "instagram" | "pinterest" | "voice" | "scan";
  sourceUrl: string;
  sourceDomain?: string | null;
  importedAt: string;
  mediaVideoUrl?: string | null;
  mediaImageUrl?: string | null;
  mediaLocalPath?: string | null;
}
