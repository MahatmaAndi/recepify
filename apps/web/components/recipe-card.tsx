import Link from "next/link";
import type { Recipe } from "@recepify/shared/types/recipe";
import { Badge } from "@/components/ui/badge";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg">{recipe.title}</CardTitle>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {recipe.mealType && <Badge variant="subtle">{recipe.mealType}</Badge>}
          {recipe.totalTime && <span>{recipe.totalTime}</span>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
        <Link href={`/recipes/${recipe.id}`} className="text-sm font-semibold text-primary hover:underline">
          View details →
        </Link>
      </CardContent>
    </Card>
  );
}
