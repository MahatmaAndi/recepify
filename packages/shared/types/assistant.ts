export type AssistantRole = "user" | "assistant";

export interface RecipeAssistantMessage {
  role: AssistantRole;
  content: string;
}

export interface RecipeAssistantRecipePayload {
  title: string;
  description?: string;
  servings?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  difficulty?: string;
  mealType?: string;
  source?: string;
  tags: string[];
  notes?: string;
  ingredients: string[];
  steps: string[];
}

export interface RecipeAssistantRequestPayload {
  recipe: RecipeAssistantRecipePayload;
  messages: RecipeAssistantMessage[];
  structured?: boolean;
}

export interface RecipeAssistantResponsePayload {
  reply: string;
}

export interface RecipeFinderCandidatePayload {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  category?: string;
  ingredients: string[];
  steps: string[];
  notes?: string;
  nutritionCalories?: string;
  nutritionProtein?: string;
  nutritionCarbs?: string;
  nutritionFat?: string;
  isFavorite?: boolean;
}

export interface RecipeFinderRequestPayload {
  query: string;
  recipes: RecipeFinderCandidatePayload[];
}

export interface RecipeFinderMatchPayload {
  id: string;
  summary: string;
}

export interface RecipeFinderResponsePayload {
  reply: string;
  matches: RecipeFinderMatchPayload[];
}
