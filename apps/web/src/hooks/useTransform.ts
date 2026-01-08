import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransformRequest } from "@echo-lab/shared";
import { ApiClient } from "../lib/api-client";
import { runBrowser } from "../lib/effect-runtime";
import { historyQueryKey } from "./useHistory";

/**
 * useTransform - Hook for performing text transformations
 *
 * Uses TanStack Query mutation to call the transform API.
 * Invalidates the history query on success to refresh the list.
 */
export function useTransform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: TransformRequest) => runBrowser(ApiClient.transform(request)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyQueryKey });
    },
  });
}
