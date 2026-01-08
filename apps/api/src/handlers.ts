import { HttpApiBuilder } from "@effect/platform";
import { DateTime, Effect } from "effect";
import { EchoLabApi } from "./api.js";
import { HistoryService } from "./services/HistoryService.js";
import {
  type TransformationError,
  TransformationService,
} from "./services/TransformationService.js";

/**
 * Transform API Handlers - Route handler implementations
 *
 * Implements the three endpoints defined in TransformGroup:
 * - POST /api/transform - Transform text and add to history
 * - GET /api/transform/history - Get all transformation history
 * - DELETE /api/transform/history - Clear history
 */
export const TransformGroupHandlers = HttpApiBuilder.group(EchoLabApi, "transform", (handlers) =>
  handlers
    .handle("transform", ({ payload }) =>
      Effect.gen(function* () {
        const transformationService = yield* TransformationService;
        const historyService = yield* HistoryService;

        const result = yield* transformationService.transform(payload);

        yield* historyService.add(result);

        return {
          id: result.id,
          original: result.original,
          result: result.result,
          transformation: result.transformation,
          timestamp: DateTime.unsafeFromDate(result.timestamp),
        };
      }).pipe(
        Effect.catchTag("TransformationError", (error: TransformationError) =>
          Effect.fail({
            _tag: error._tag,
            message: error.message,
          }),
        ),
      ),
    )
    .handle("getHistory", () =>
      Effect.gen(function* () {
        const historyService = yield* HistoryService;
        const items = yield* historyService.getAll();

        return {
          items: items.map((item) => ({
            id: item.id,
            original: item.original,
            result: item.result,
            transformation: item.transformation,
            timestamp: DateTime.unsafeFromDate(item.timestamp),
          })),
        };
      }),
    )
    .handle("clearHistory", () =>
      Effect.gen(function* () {
        const historyService = yield* HistoryService;
        yield* historyService.clear();

        return { message: "History cleared" };
      }),
    ),
);
