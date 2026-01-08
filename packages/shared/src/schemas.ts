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
