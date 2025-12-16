import { Button } from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Recipefy</CardTitle>
          <p className="text-sm text-muted-foreground">Import recipes from the web, TikTok, and Pinterest in one clean workspace.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Import via URL and auto-fill structured data.</li>
            <li>Edit ingredients, instructions, and nutrition.</li>
            <li>Keep videos and hero images organized.</li>
          </ul>
          <Button asChild className="w-full">
            <Link href="/">Get started</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
