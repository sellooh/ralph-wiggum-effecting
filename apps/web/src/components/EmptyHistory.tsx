import { History } from "lucide-react";

/**
 * EmptyHistory - Empty state shown when no history exists
 *
 * Displays an icon and helpful text to indicate the history panel
 * is empty and where transformation history will appear.
 */
export function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <History className="h-12 w-12 text-muted-foreground/50 mb-3" />
      <p className="text-sm text-muted-foreground">No transformations yet</p>
      <p className="text-xs text-muted-foreground/75">
        Your transformation history will appear here
      </p>
    </div>
  );
}
