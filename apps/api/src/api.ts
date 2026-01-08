import { HttpApi, HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform";
import { Schema } from "effect";
import { TransformRequest } from "@echo-lab/shared";

/**
 * TransformResultJson - Schema for JSON serialization of TransformResult
 * Uses DateTimeUtc for proper JSON encoding of timestamps
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

/**
 * HistoryResponse - Response schema for GET /history
 */
const HistoryResponse = Schema.Struct({
  items: Schema.Array(TransformResultJson),
});

/**
 * ErrorResponse - Generic error response schema
 */
const ErrorResponse = Schema.Struct({
  _tag: Schema.String,
  message: Schema.String,
});

/**
 * Transform API Group - Endpoints for text transformation and history
 *
 * Endpoints:
 * - POST /transform - Transform text using the specified transformation type
 * - GET /transform/history - Get all transformation history
 * - DELETE /transform/history - Clear all transformation history
 */
export class TransformGroup extends HttpApiGroup.make("transform")
  .add(
    HttpApiEndpoint.post("transform", "/transform")
      .setPayload(TransformRequest)
      .addSuccess(TransformResultJson)
      .addError(ErrorResponse, { status: 400 }),
  )
  .add(HttpApiEndpoint.get("getHistory", "/transform/history").addSuccess(HistoryResponse))
  .add(
    HttpApiEndpoint.del("clearHistory", "/transform/history").addSuccess(
      Schema.Struct({ message: Schema.String }),
    ),
  )
  .prefix("/api") {}

/**
 * Echo Lab API - Main API definition
 *
 * Includes OpenAPI documentation metadata for Scalar docs
 */
export class EchoLabApi extends HttpApi.make("echo-lab")
  .add(TransformGroup)
  .annotate(OpenApi.Title, "Echo Lab API")
  .annotate(OpenApi.Description, "Text transformation API with history tracking")
  .annotate(OpenApi.Version, "1.0.0") {}
