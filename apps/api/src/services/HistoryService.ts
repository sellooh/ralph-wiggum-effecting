import { Context, Effect, Layer, Ref } from "effect";
import type { TransformResult } from "@echo-lab/shared";

export class HistoryService extends Context.Tag("HistoryService")<
  HistoryService,
  {
    readonly add: (result: TransformResult) => Effect.Effect<void>;
    readonly getAll: () => Effect.Effect<ReadonlyArray<TransformResult>>;
    readonly clear: () => Effect.Effect<void>;
  }
>() {}

export const HistoryServiceLive = Layer.effect(
  HistoryService,
  Effect.gen(function* () {
    const historyRef = yield* Ref.make<ReadonlyArray<TransformResult>>([]);

    return HistoryService.of({
      add: (result) =>
        Ref.update(historyRef, (history) => [...history, result]),

      getAll: () => Ref.get(historyRef),

      clear: () => Ref.set(historyRef, []),
    });
  }),
);
