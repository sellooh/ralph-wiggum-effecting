import { useAtom } from "@effect-atom/atom-react";
import { History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { TransformCard } from "@/components/TransformCard";
import { HistoryPanel } from "@/components/HistoryPanel";
import { isHistoryOpenAtom } from "@/atoms";

export function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useAtom(isHistoryOpenAtom);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl sm:text-2xl">Echo Lab</CardTitle>
            <CardDescription>Transform your text with various operations</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            aria-label={isHistoryOpen ? "Close history" : "Open history"}
          >
            <History className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <TransformCard />
        </CardContent>
      </Card>
      <HistoryPanel />
      <Toaster />
    </div>
  );
}
