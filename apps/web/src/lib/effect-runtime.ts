import { FetchHttpClient } from "@effect/platform";
import { Layer, ManagedRuntime } from "effect";

/**
 * Browser Runtime Layer
 *
 * Provides all the necessary services for running Effects in the browser.
 * Uses FetchHttpClient for HTTP requests (browser-native fetch API).
 */
export const BrowserLayer = Layer.mergeAll(FetchHttpClient.layer);

/**
 * Browser Runtime
 *
 * A managed runtime configured for browser execution.
 * This runtime provides:
 * - FetchHttpClient: HTTP client using browser's native fetch
 *
 * Usage:
 * ```ts
 * import { BrowserRuntime } from './lib/effect-runtime';
 *
 * const result = await BrowserRuntime.runPromise(someEffect);
 * ```
 */
export const BrowserRuntime = ManagedRuntime.make(BrowserLayer);

/**
 * Helper to run an Effect with the browser runtime
 *
 * @param effect - The Effect to execute
 * @returns A Promise that resolves with the effect's result
 */
export const runBrowser = <A, E>(
  effect: Parameters<typeof BrowserRuntime.runPromise<A, E>>[0],
): Promise<A> => BrowserRuntime.runPromise(effect);
