import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { TransformResult } from "@echo-lab/shared";
import { HistoryService, HistoryServiceLive } from "./HistoryService.js";

const createMockResult = (id: string, text: string): TransformResult => ({
  id,
  original: text,
  result: text.toUpperCase(),
  transformation: "uppercase",
  timestamp: new Date(),
});

const runWithHistory = <A, E>(effect: Effect.Effect<A, E, HistoryService>): Promise<A> =>
  Effect.runPromise(Effect.provide(effect, HistoryServiceLive));

describe("HistoryService", () => {
  describe("getAll", () => {
    it("should return empty array initially", async () => {
      const result = await runWithHistory(
        Effect.gen(function* () {
          const service = yield* HistoryService;
          return yield* service.getAll();
        }),
      );

      expect(result).toEqual([]);
    });
  });

  describe("add", () => {
    it("should add a single result", async () => {
      const mockResult = createMockResult("1", "hello");

      const result = await runWithHistory(
        Effect.gen(function* () {
          const service = yield* HistoryService;
          yield* service.add(mockResult);
          return yield* service.getAll();
        }),
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockResult);
    });

    it("should add multiple results in order", async () => {
      const result1 = createMockResult("1", "first");
      const result2 = createMockResult("2", "second");
      const result3 = createMockResult("3", "third");

      const results = await runWithHistory(
        Effect.gen(function* () {
          const service = yield* HistoryService;
          yield* service.add(result1);
          yield* service.add(result2);
          yield* service.add(result3);
          return yield* service.getAll();
        }),
      );

      expect(results).toHaveLength(3);
      expect(results[0]).toEqual(result1);
      expect(results[1]).toEqual(result2);
      expect(results[2]).toEqual(result3);
    });

    it("should preserve result data", async () => {
      const mockResult: TransformResult = {
        id: "test-id-123",
        original: "hello world",
        result: "HELLO WORLD",
        transformation: "uppercase",
        timestamp: new Date("2024-01-01T00:00:00Z"),
      };

      const results = await runWithHistory(
        Effect.gen(function* () {
          const service = yield* HistoryService;
          yield* service.add(mockResult);
          return yield* service.getAll();
        }),
      );

      expect(results).toHaveLength(1);
      const first = results[0]!;
      expect(first).toEqual(mockResult);
      expect(first.id).toBe("test-id-123");
      expect(first.original).toBe("hello world");
      expect(first.result).toBe("HELLO WORLD");
      expect(first.transformation).toBe("uppercase");
      expect(first.timestamp).toEqual(new Date("2024-01-01T00:00:00Z"));
    });
  });

  describe("clear", () => {
    it("should clear all history", async () => {
      const result1 = createMockResult("1", "first");
      const result2 = createMockResult("2", "second");

      const results = await runWithHistory(
        Effect.gen(function* () {
          const service = yield* HistoryService;
          yield* service.add(result1);
          yield* service.add(result2);
          yield* service.clear();
          return yield* service.getAll();
        }),
      );

      expect(results).toEqual([]);
    });

    it("should work on empty history", async () => {
      const results = await runWithHistory(
        Effect.gen(function* () {
          const service = yield* HistoryService;
          yield* service.clear();
          return yield* service.getAll();
        }),
      );

      expect(results).toEqual([]);
    });

    it("should allow adding after clear", async () => {
      const result1 = createMockResult("1", "before");
      const result2 = createMockResult("2", "after");

      const results = await runWithHistory(
        Effect.gen(function* () {
          const service = yield* HistoryService;
          yield* service.add(result1);
          yield* service.clear();
          yield* service.add(result2);
          return yield* service.getAll();
        }),
      );

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(result2);
    });
  });

  describe("isolation", () => {
    it("should have isolated state per layer instance", async () => {
      const result1 = createMockResult("1", "instance1");
      const result2 = createMockResult("2", "instance2");

      const firstInstance = await runWithHistory(
        Effect.gen(function* () {
          const service = yield* HistoryService;
          yield* service.add(result1);
          return yield* service.getAll();
        }),
      );

      const secondInstance = await runWithHistory(
        Effect.gen(function* () {
          const service = yield* HistoryService;
          yield* service.add(result2);
          return yield* service.getAll();
        }),
      );

      expect(firstInstance).toHaveLength(1);
      expect(firstInstance.at(0)?.original).toBe("instance1");
      expect(secondInstance).toHaveLength(1);
      expect(secondInstance.at(0)?.original).toBe("instance2");
    });
  });

  describe("transformation types", () => {
    it("should handle all transformation types", async () => {
      const transformations = [
        "uppercase",
        "lowercase",
        "reverse",
        "base64-encode",
        "base64-decode",
        "count",
      ] as const;

      for (const transformation of transformations) {
        const mockResult: TransformResult = {
          id: `test-${transformation}`,
          original: "test",
          result: "TEST",
          transformation,
          timestamp: new Date(),
        };

        const results = await runWithHistory(
          Effect.gen(function* () {
            const service = yield* HistoryService;
            yield* service.add(mockResult);
            return yield* service.getAll();
          }),
        );

        expect(results.at(0)?.transformation).toBe(transformation);
      }
    });
  });
});
