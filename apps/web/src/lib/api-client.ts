import { HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Effect, Schema } from "effect";
import type { TransformRequest as TransformRequestType } from "@echo-lab/shared";

/**
 * TransformResultJson - Schema for JSON deserialization of TransformResult
 * Matches the API response format with DateTimeUtc for timestamps
 */
const TransformResultJson = Schema.Struct({
  id: Schema.String,
  original: Schema.String,
  result: Schema.String,
  transformation: Schema.Literal(
    "uppercase",
    "lowercase",
    "reverse",
    "base64-encode",
    "base64-decode",
    "count",
  ),
  timestamp: Schema.DateTimeUtc,
});

export type TransformResult = typeof TransformResultJson.Type;

/**
 * HistoryResponse - Response schema for GET /history
 */
const HistoryResponse = Schema.Struct({
  items: Schema.Array(TransformResultJson),
});

export type HistoryResponse = typeof HistoryResponse.Type;

/**
 * ClearHistoryResponse - Response schema for DELETE /history
 */
const ClearHistoryResponse = Schema.Struct({
  message: Schema.String,
});

export type ClearHistoryResponse = typeof ClearHistoryResponse.Type;

/**
 * ErrorResponse - API error response schema
 */
const ErrorResponse = Schema.Struct({
  _tag: Schema.String,
  message: Schema.String,
});

export type ErrorResponse = typeof ErrorResponse.Type;

/**
 * API Client - Typed HTTP client for Echo Lab API
 *
 * Uses @effect/platform HttpClient for type-safe HTTP requests.
 * All methods return Effects that require HttpClient service.
 */
export const ApiClient = {
  /**
   * Transform text using the specified transformation type
   *
   * POST /api/transform
   */
  transform: (request: TransformRequestType) =>
    Effect.gen(function* () {
      const client = yield* HttpClient.HttpClient;

      const response = yield* client.execute(
        HttpClientRequest.post("/api/transform").pipe(HttpClientRequest.bodyUnsafeJson(request)),
      );

      if (response.status >= 400) {
        const error = yield* HttpClientResponse.schemaBodyJson(ErrorResponse)(response);
        return yield* Effect.fail(error);
      }

      return yield* HttpClientResponse.schemaBodyJson(TransformResultJson)(response);
    }),

  /**
   * Get all transformation history
   *
   * GET /api/transform/history
   */
  getHistory: () =>
    Effect.gen(function* () {
      const client = yield* HttpClient.HttpClient;

      const response = yield* client.execute(HttpClientRequest.get("/api/transform/history"));

      return yield* HttpClientResponse.schemaBodyJson(HistoryResponse)(response);
    }),

  /**
   * Clear all transformation history
   *
   * DELETE /api/transform/history
   */
  clearHistory: () =>
    Effect.gen(function* () {
      const client = yield* HttpClient.HttpClient;

      const response = yield* client.execute(HttpClientRequest.del("/api/transform/history"));

      return yield* HttpClientResponse.schemaBodyJson(ClearHistoryResponse)(response);
    }),
};
