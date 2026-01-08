// @echo-lab/shared - Shared types and schemas for Echo Lab

export const VERSION = "0.0.0" as const;

// Re-export all schemas
export {
  TransformationType,
  TransformRequest,
  TransformResult,
} from "./schemas.js";
export type {
  TransformationType as TransformationTypeType,
  TransformRequest as TransformRequestType,
  TransformResult as TransformResultType,
} from "./schemas.js";

// Re-export all errors
export {
  InvalidInput,
  TransformationFailed,
  TransformError,
} from "./errors.js";
export type {
  InvalidInput as InvalidInputType,
  TransformationFailed as TransformationFailedType,
  TransformError as TransformErrorType,
} from "./errors.js";
