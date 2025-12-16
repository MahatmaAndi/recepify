import type { Recipe } from "@/types/recipe";
import { v4 as uuid } from "uuid";

export const mockRecipes: Recipe[] = Array.from({ length: 4 }).map((_, index) => {
  const id = uuid();
  return {
    id,
    title: `Sample Recipe ${index + 1}`,
    description: "This is a placeholder description until backend wiring is complete.",
    mealType: index % 2 === 0 ? "Dinner" : "Lunch",
    difficulty: index % 3 === 0 ? "Medium" : "Easy",
    prepTime: "15 min",
    cookTime: "25 min",
    totalTime: "40 min",
    servings: "4",
    nutritionCalories: "320",
    nutritionProtein: "12g",
    nutritionCarbs: "45g",
    nutritionFat: "10g",
    ingredients: [],
    instructions: [],
    tags: ["Placeholder"],
    chefNotes: null,
    sourcePlatform: "web",
    sourceUrl: "https://example.com",
    sourceDomain: "example.com",
    importedAt: new Date().toISOString(),
    mediaVideoUrl: null,
    mediaImageUrl: null,
    mediaLocalPath: null
  };
});
