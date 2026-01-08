import { Schema } from "effect";

/**
 * TransformationType - Literal union of available text transformations
 */
export const TransformationType = Schema.Literal(
  "uppercase",
  "lowercase",
  "reverse",
  "base64-encode",
  "base64-decode",
  "count",
);

export type TransformationType = typeof TransformationType.Type;

/**
 * TransformRequest - Request payload for text transformation
 */
export const TransformRequest = Schema.Struct({
  text: Schema.String,
  transformation: TransformationType,
});

export type TransformRequest = typeof TransformRequest.Type;

/**
 * TransformResult - Response payload with transformation result
 */
export const TransformResult = Schema.Struct({
  id: Schema.String,
  original: Schema.String,
  result: Schema.String,
  transformation: TransformationType,
  timestamp: Schema.DateFromSelf,
});

export type TransformResult = typeof TransformResult.Type;
