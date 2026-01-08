import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";

export function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Echo Lab</CardTitle>
          <CardDescription>Transform your text with various operations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select a transformation and enter your text to get started.
          </p>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
