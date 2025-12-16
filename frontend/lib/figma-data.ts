import type { ImportItem, Recipe } from "@/types/figma";

export const figmaRecipes: Recipe[] = [
  {
    id: "r1",
    title: "Crispy Chili Oil Noodles",
    description: "Chewy rice noodles tossed in a garlicky chili crisp sauce with bok choy and scallions.",
    thumbnail: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=60",
    duration: "25 min",
    prepTime: "10 min",
    cookTime: "15 min",
    totalTime: "25 min",
    servings: 2,
    difficulty: "easy",
    category: "Dinner",
    source: "tiktok",
    tags: ["Vegetarian", "Spicy", "Weeknight"],
    isFavorite: true,
    ingredients: [
      { id: "r1-ing-1", amount: "8 oz", name: "wide rice noodles" },
      { id: "r1-ing-2", amount: "2 tbsp", name: "chili crisp" },
      { id: "r1-ing-3", amount: "3 cloves", name: "garlic, minced" },
      { id: "r1-ing-4", amount: "2 tbsp", name: "soy sauce" },
      { id: "r1-ing-5", amount: "1 tbsp", name: "rice vinegar" },
      { id: "r1-ing-6", amount: "2 heads", name: "baby bok choy, sliced" },
      { id: "r1-ing-7", amount: "2", name: "scallions, thinly sliced" },
      { id: "r1-ing-8", amount: "1 tsp", name: "toasted sesame seeds" }
    ],
    steps: [
      "Cook noodles according to package instructions until chewy. Reserve 1/4 cup cooking water.",
      "In a pan, warm chili crisp with garlic until fragrant. Stir in soy sauce, rice vinegar, and noodle water.",
      "Add bok choy and sauté until wilted. Toss in noodles until coated.",
      "Serve topped with scallions and sesame seeds. Add extra chili crisp to taste."
    ],
    notes: "Great with a soft boiled egg or leftover shredded chicken.",
    nutrition: { calories: 520, protein: "14g", carbs: "68g", fat: "20g" }
  },
  {
    id: "r2",
    title: "Lemon Herb Roast Chicken",
    description: "Juicy spatchcocked chicken roasted with potatoes, charred lemon, and thyme butter.",
    thumbnail: "https://images.unsplash.com/photo-1475090169767-40ed8d18f67d?auto=format&fit=crop&w=800&q=60",
    duration: "1 hr",
    prepTime: "15 min",
    cookTime: "45 min",
    totalTime: "1 hr",
    servings: 4,
    difficulty: "medium",
    category: "Dinner",
    source: "web",
    tags: ["Meal Prep", "Gluten-Free"],
    isFavorite: false,
    ingredients: [
      { id: "r2-ing-1", amount: "1", name: "whole chicken (3.5 lb), spatchcocked" },
      { id: "r2-ing-2", amount: "3 tbsp", name: "softened butter" },
      { id: "r2-ing-3", amount: "2", name: "lemons, zested and halved" },
      { id: "r2-ing-4", amount: "4 cloves", name: "garlic, smashed" },
      { id: "r2-ing-5", amount: "1 lb", name: "baby potatoes, halved" },
      { id: "r2-ing-6", amount: "1 bunch", name: "fresh thyme" },
      { id: "r2-ing-7", amount: "2 tbsp", name: "olive oil" },
      { id: "r2-ing-8", name: "Kosher salt & cracked pepper" }
    ],
    steps: [
      "Heat oven to 425°F. Pat chicken dry and place on a rimmed sheet tray.",
      "Mix butter with lemon zest, thyme leaves, salt, and pepper. Rub under and over the skin.",
      "Toss potatoes and garlic with olive oil and arrange around chicken. Add lemon halves cut-side down.",
      "Roast 40-45 minutes until skin is crisp and meat reaches 165°F. Rest 10 minutes before carving."
    ],
    notes: "Broil for 2 minutes at the end for extra crispy skin.",
    nutrition: { calories: 640, protein: "48g", carbs: "32g", fat: "32g" }
  },
  {
    id: "r3",
    title: "Matcha Coconut Overnight Oats",
    description: "Make-ahead breakfast jars layered with chia pudding, matcha oats, and toasted coconut flakes.",
    thumbnail: "https://images.unsplash.com/photo-1475090169767-485b36e66b6f?auto=format&fit=crop&w=800&q=60",
    duration: "10 min",
    prepTime: "10 min",
    cookTime: "—",
    totalTime: "4 hr chill",
    servings: 2,
    difficulty: "easy",
    category: "Breakfast",
    source: "pinterest",
    tags: ["Vegan", "Meal Prep", "Dairy-Free"],
    isFavorite: true,
    ingredients: [
      { id: "r3-ing-1", amount: "1 cup", name: "rolled oats" },
      { id: "r3-ing-2", amount: "1 tbsp", name: "matcha powder" },
      { id: "r3-ing-3", amount: "1.5 cups", name: "almond milk" },
      { id: "r3-ing-4", amount: "2 tbsp", name: "chia seeds" },
      { id: "r3-ing-5", amount: "2 tbsp", name: "maple syrup" },
      { id: "r3-ing-6", amount: "1/2 cup", name: "coconut yogurt" },
      { id: "r3-ing-7", name: "Toasted coconut flakes, for topping" },
      { id: "r3-ing-8", name: "Fresh berries" }
    ],
    steps: [
      "In jars combine oats, matcha, almond milk, and maple syrup. Stir until smooth.",
      "Stir chia seeds into the top layer and add coconut yogurt.",
      "Chill at least 4 hours or overnight.",
      "Top with toasted coconut and berries before serving."
    ],
    notes: "Add vanilla protein powder for extra staying power.",
    nutrition: { calories: 380, protein: "9g", carbs: "52g", fat: "14g" }
  },
  {
    id: "r4",
    title: "One-Pot Tuscan Orzo",
    description: "Creamy tomato basil orzo with sun-dried tomatoes, kale, and parmesan. Ready in 30 minutes.",
    thumbnail: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=60",
    duration: "30 min",
    prepTime: "10 min",
    cookTime: "20 min",
    totalTime: "30 min",
    servings: 4,
    difficulty: "easy",
    category: "Dinner",
    source: "instagram",
    tags: ["One-Pot", "Vegetarian"],
    isFavorite: false,
    ingredients: [
      { id: "r4-ing-1", amount: "1 tbsp", name: "olive oil" },
      { id: "r4-ing-2", amount: "3 cloves", name: "garlic, minced" },
      { id: "r4-ing-3", amount: "1 cup", name: "sun-dried tomatoes, sliced" },
      { id: "r4-ing-4", amount: "1 cup", name: "orzo pasta" },
      { id: "r4-ing-5", amount: "2 cups", name: "vegetable broth" },
      { id: "r4-ing-6", amount: "1 cup", name: "heavy cream" },
      { id: "r4-ing-7", amount: "2 cups", name: "chopped kale" },
      { id: "r4-ing-8", amount: "1/2 cup", name: "grated parmesan" },
      { id: "r4-ing-9", name: "Fresh basil, for serving" }
    ],
    steps: [
      "Sauté garlic and sun-dried tomatoes in olive oil until fragrant.",
      "Add orzo and toast 1 minute. Pour in broth and cream, then bring to a simmer.",
      "Cook 10 minutes until orzo is al dente. Stir frequently.",
      "Fold in kale and parmesan until wilted and creamy. Season to taste."
    ],
    notes: "Finish with chili flakes for a little heat.",
    nutrition: { calories: 560, protein: "17g", carbs: "58g", fat: "28g" }
  }
];

export const figmaImportItems: ImportItem[] = [
  {
    id: "import-1",
    title: "Spicy Chili Crunch Ramen · @noodlebae",
    platform: "tiktok",
    status: "processing",
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    thumbnail: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=400&q=60",
    progress: 30,
    progressMessage: "Fetching recipe..."
  },
  {
    id: "import-2",
    title: "15-min Burrata Tomato Toast",
    platform: "instagram",
    status: "ready",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=60"
  },
  {
    id: "import-3",
    title: "Viral Cottage Cheese Flatbread",
    platform: "tiktok",
    status: "needsConnection",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    thumbnail: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=400&q=60"
  },
  {
    id: "import-4",
    title: "Pistachio Tiramisu",
    platform: "pinterest",
    status: "failed",
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
    thumbnail: "https://images.unsplash.com/photo-1505253216365-0204a8f1db9b?auto=format&fit=crop&w=400&q=60"
  }
];
