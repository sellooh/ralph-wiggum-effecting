import { useAtom } from "@effect-atom/atom-react";
import { History, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isHistoryOpenAtom } from "@/atoms";
import { useHistory, useClearHistory } from "@/hooks/useHistory";
import { HistoryItem } from "./HistoryItem";
import { EmptyHistory } from "./EmptyHistory";

/**
 * HistoryItemSkeleton - Loading placeholder for history items
 */
function HistoryItemSkeleton() {
  return (
    <div className="space-y-2 py-3">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-5 w-full" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  );
}

/**
 * HistoryPanel - Sidebar/collapsible section showing transformation history
 *
 * Uses useHistory hook to fetch data and displays history items.
 * Can be toggled via isHistoryOpenAtom.
 */
export function HistoryPanel() {
  const [isOpen, setIsOpen] = useAtom(isHistoryOpenAtom);
  const history = useHistory();
  const clearHistory = useClearHistory();

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <History className="h-4 w-4" />
        <span className="sr-only">Show history</span>
      </Button>
    );
  }

  const items = history.data?.items ?? [];

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-80 border-l bg-background shadow-lg animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <h2 className="font-semibold">History</h2>
        </div>
        <div className="flex items-center gap-1">
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => clearHistory.mutate()}
              disabled={clearHistory.isPending}
              title="Clear history"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear history</span>
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close history</span>
          </Button>
        </div>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-65px)]">
        {history.isLoading ? (
          <div className="divide-y">
            <HistoryItemSkeleton />
            <HistoryItemSkeleton />
            <HistoryItemSkeleton />
          </div>
        ) : history.isError ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-destructive">Failed to load history</p>
          </div>
        ) : items.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div className="divide-y">
            {items.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
