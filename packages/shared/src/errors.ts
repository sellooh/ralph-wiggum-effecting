import { Schema } from "effect";

/**
 * InvalidInput - Error when input validation fails
 */
export const InvalidInput = Schema.Struct({
	_tag: Schema.Literal("InvalidInput"),
	message: Schema.String,
});

export type InvalidInput = typeof InvalidInput.Type;

/**
 * TransformationFailed - Error when transformation execution fails
 */
export const TransformationFailed = Schema.Struct({
	_tag: Schema.Literal("TransformationFailed"),
	message: Schema.String,
	cause: Schema.optional(Schema.String),
});

export type TransformationFailed = typeof TransformationFailed.Type;

/**
 * TransformError - Union of all possible transformation errors
 */
export const TransformError = Schema.Union(InvalidInput, TransformationFailed);

export type TransformError = typeof TransformError.Type;
