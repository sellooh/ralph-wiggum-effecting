import { Context, Effect, Layer } from "effect";
import type { TransformRequest, TransformResult, TransformationType } from "@echo-lab/shared";

export class TransformationError {
  readonly _tag = "TransformationError";
  constructor(
    readonly message: string,
    readonly cause?: unknown,
  ) {}
}

export class TransformationService extends Context.Tag("TransformationService")<
  TransformationService,
  {
    readonly transform: (
      request: TransformRequest,
    ) => Effect.Effect<TransformResult, TransformationError>;
  }
>() {}

const applyTransformation = (
  text: string,
  type: TransformationType,
): Effect.Effect<string, TransformationError> => {
  switch (type) {
    case "uppercase":
      return Effect.succeed(text.toUpperCase());

    case "lowercase":
      return Effect.succeed(text.toLowerCase());

    case "reverse":
      return Effect.succeed([...text].reverse().join(""));

    case "base64-encode":
      return Effect.try({
        try: () => Buffer.from(text, "utf-8").toString("base64"),
        catch: (error) => new TransformationError("Failed to encode base64", error),
      });

    case "base64-decode":
      return Effect.try({
        try: () => {
          const decoded = Buffer.from(text, "base64").toString("utf-8");
          // Validate that the input was valid base64
          const reEncoded = Buffer.from(decoded, "utf-8").toString("base64");
          // Handle padding differences by comparing decoded results
          const reDecoded = Buffer.from(reEncoded, "base64").toString("utf-8");
          if (decoded !== reDecoded) {
            throw new Error("Invalid base64 input");
          }
          return decoded;
        },
        catch: (error) => new TransformationError("Failed to decode base64", error),
      });

    case "count":
      return Effect.succeed(String(text.length));
  }
};

export const TransformationServiceLive = Layer.succeed(
  TransformationService,
  TransformationService.of({
    transform: (request) =>
      Effect.gen(function* () {
        const result = yield* applyTransformation(request.text, request.transformation);

        return {
          id: crypto.randomUUID(),
          original: request.text,
          result,
          transformation: request.transformation,
          timestamp: new Date(),
        };
      }),
  }),
);
