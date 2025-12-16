import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Settings</p>
        <h1 className="text-3xl font-semibold tracking-tight">Workspace</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Storage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Total size in use: —</p>
            <p>Media stored on device: /backend/storage</p>
            <Button variant="outline" disabled>
              Manage Storage
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Download your recipe library as JSON for backup.</p>
            <Button disabled>Export JSON</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
