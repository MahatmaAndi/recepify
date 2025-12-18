import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockRecipes } from "@recepify/shared/lib/mock-data";

interface EditRecipePageProps {
  params: { id: string };
}

export default function EditRecipePage({ params }: EditRecipePageProps) {
  const recipe = mockRecipes.find((item) => item.id === params.id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost">
          <Link href={`/recipes/${recipe.id}`}>← Back</Link>
        </Button>
        <h1 className="text-3xl font-semibold tracking-tight flex-1">Edit Recipe</h1>
        <Button disabled>Save</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            className="h-12 w-full rounded-xl border border-border px-4 text-sm focus:border-foreground focus:outline-none"
            placeholder="Title"
            defaultValue={recipe.title}
            disabled
          />
          <textarea
            className="min-h-[120px] w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-foreground focus:outline-none"
            placeholder="Description"
            defaultValue={recipe.description ?? ""}
            disabled
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients & Steps</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ingredients</label>
            <textarea
              className="min-h-[200px] w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              placeholder="Add ingredients"
              disabled
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Instructions</label>
            <textarea
              className="min-h-[200px] w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              placeholder="Add steps"
              disabled
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
