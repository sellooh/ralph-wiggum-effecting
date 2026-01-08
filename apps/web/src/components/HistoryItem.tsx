import type { TransformResult } from "@/lib/api-client";

/**
 * Format timestamp for display
 */
function formatTimestamp(timestamp: TransformResult["timestamp"]): string {
  const date = new Date(Number(timestamp.epochMillis));
  return date.toLocaleString();
}

/**
 * Get a user-friendly label for transformation type
 */
function getTransformationLabel(transformation: TransformResult["transformation"]): string {
  const labels: Record<TransformResult["transformation"], string> = {
    uppercase: "Uppercase",
    lowercase: "Lowercase",
    reverse: "Reverse",
    "base64-encode": "Base64 Encode",
    "base64-decode": "Base64 Decode",
    count: "Count",
  };
  return labels[transformation];
}

/**
 * Truncate text with ellipsis
 */
function truncateText(text: string, maxLength = 50): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

interface HistoryItemProps {
  item: TransformResult;
}

/**
 * HistoryItem - Individual history item display
 *
 * Shows:
 * - Transformation type badge
 * - Timestamp
 * - Truncated original text
 * - Truncated result text
 */
export function HistoryItem({ item }: HistoryItemProps) {
  return (
    <div className="space-y-2 py-3 animate-in fade-in slide-in-from-right-2 duration-300">
      <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2">
        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          {getTransformationLabel(item.transformation)}
        </span>
        <span className="text-xs text-muted-foreground truncate">
          {formatTimestamp(item.timestamp)}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Original:</p>
        <p className="font-mono text-sm break-all">{truncateText(item.original)}</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Result:</p>
        <p className="font-mono text-sm break-all">{truncateText(item.result)}</p>
      </div>
    </div>
  );
}
