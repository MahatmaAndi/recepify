import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { mockRecipes } from "@/lib/mock-data";
import { Separator } from "@/components/ui/separator";

interface RecipeDetailPageProps {
  params: { id: string };
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const recipe = mockRecipes.find((item) => item.id === params.id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Recipe</p>
          <h1 className="text-3xl font-semibold tracking-tight">{recipe.title}</h1>
          <p className="text-muted-foreground">{recipe.description}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/recipes/${recipe.id}/edit`}>Edit Recipe</Link>
        </Button>
      </header>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
          <div>
            <p className="font-semibold text-foreground">Meal</p>
            <p>{recipe.mealType ?? "—"}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Total Time</p>
            <p>{recipe.totalTime ?? "—"}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Servings</p>
            <p>{recipe.servings ?? "—"}</p>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-semibold tracking-tight">Ingredients</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {(recipe.ingredients.length ? recipe.ingredients : [{ id: "placeholder", line: "Add ingredients" }]).map((ing) => (
                <li key={ing.id}>{ing.line}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold tracking-tight">Instructions</h2>
            <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
              {(recipe.instructions.length
                ? recipe.instructions
                : [{ id: "placeholder", stepNumber: 1, text: "Add detailed steps." }]).map((step) => (
                <li key={step.id ?? step.stepNumber}>
                  <span className="font-semibold text-foreground">{step.stepNumber}. </span>
                  {step.text}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
