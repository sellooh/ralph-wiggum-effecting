import { cn } from "@/lib/utils";

/**
 * Skeleton - Loading placeholder with pulse animation
 *
 * Use to show loading states while content is being fetched.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
