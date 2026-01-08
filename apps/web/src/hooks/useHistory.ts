import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "../lib/api-client";
import { runBrowser } from "../lib/effect-runtime";

/**
 * Query key for history data
 */
export const historyQueryKey = ["history"] as const;

/**
 * useHistory - Hook for fetching transformation history
 *
 * Uses TanStack Query to fetch and cache history data.
 * The Effect is executed using the browser runtime.
 */
export function useHistory() {
  return useQuery({
    queryKey: historyQueryKey,
    queryFn: () => runBrowser(ApiClient.getHistory()),
  });
}

/**
 * useClearHistory - Hook for clearing transformation history
 *
 * Uses TanStack Query mutation to clear history.
 * Invalidates the history query on success.
 */
export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => runBrowser(ApiClient.clearHistory()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyQueryKey });
    },
  });
}
