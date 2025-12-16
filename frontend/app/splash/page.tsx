export default function SplashScreen() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Recipefy</p>
        <h1 className="text-4xl font-semibold tracking-tight">Loading workspace…</h1>
        <p className="text-muted-foreground">Preparing your recipes and media library.</p>
      </div>
    </div>
  );
}
