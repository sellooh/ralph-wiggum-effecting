import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import {
  TransformationError,
  TransformationService,
  TransformationServiceLive,
} from "./TransformationService.js";

const runTransform = (text: string, transformation: string) =>
  Effect.gen(function* () {
    const service = yield* TransformationService;
    return yield* service.transform({
      text,
      transformation: transformation as "uppercase",
    });
  }).pipe(Effect.provide(TransformationServiceLive));

describe("TransformationService", () => {
  describe("uppercase transformation", () => {
    it("should convert text to uppercase", async () => {
      const result = await Effect.runPromise(runTransform("hello", "uppercase"));
      expect(result.result).toBe("HELLO");
      expect(result.original).toBe("hello");
      expect(result.transformation).toBe("uppercase");
    });

    it("should handle empty string", async () => {
      const result = await Effect.runPromise(runTransform("", "uppercase"));
      expect(result.result).toBe("");
    });

    it("should handle mixed case", async () => {
      const result = await Effect.runPromise(runTransform("HeLLo WoRLd", "uppercase"));
      expect(result.result).toBe("HELLO WORLD");
    });
  });

  describe("lowercase transformation", () => {
    it("should convert text to lowercase", async () => {
      const result = await Effect.runPromise(runTransform("HELLO", "lowercase"));
      expect(result.result).toBe("hello");
      expect(result.original).toBe("HELLO");
      expect(result.transformation).toBe("lowercase");
    });

    it("should handle empty string", async () => {
      const result = await Effect.runPromise(runTransform("", "lowercase"));
      expect(result.result).toBe("");
    });

    it("should handle mixed case", async () => {
      const result = await Effect.runPromise(runTransform("HeLLo WoRLd", "lowercase"));
      expect(result.result).toBe("hello world");
    });
  });

  describe("reverse transformation", () => {
    it("should reverse text", async () => {
      const result = await Effect.runPromise(runTransform("hello", "reverse"));
      expect(result.result).toBe("olleh");
      expect(result.original).toBe("hello");
      expect(result.transformation).toBe("reverse");
    });

    it("should handle empty string", async () => {
      const result = await Effect.runPromise(runTransform("", "reverse"));
      expect(result.result).toBe("");
    });

    it("should handle palindromes", async () => {
      const result = await Effect.runPromise(runTransform("racecar", "reverse"));
      expect(result.result).toBe("racecar");
    });

    it("should handle unicode characters", async () => {
      const result = await Effect.runPromise(runTransform("abc", "reverse"));
      expect(result.result).toBe("cba");
    });
  });

  describe("base64-encode transformation", () => {
    it("should encode text to base64", async () => {
      const result = await Effect.runPromise(runTransform("hello", "base64-encode"));
      expect(result.result).toBe("aGVsbG8=");
      expect(result.original).toBe("hello");
      expect(result.transformation).toBe("base64-encode");
    });

    it("should handle empty string", async () => {
      const result = await Effect.runPromise(runTransform("", "base64-encode"));
      expect(result.result).toBe("");
    });

    it("should handle special characters", async () => {
      const result = await Effect.runPromise(runTransform("hello world!", "base64-encode"));
      expect(result.result).toBe("aGVsbG8gd29ybGQh");
    });
  });

  describe("base64-decode transformation", () => {
    it("should decode base64 to text", async () => {
      const result = await Effect.runPromise(runTransform("aGVsbG8=", "base64-decode"));
      expect(result.result).toBe("hello");
      expect(result.original).toBe("aGVsbG8=");
      expect(result.transformation).toBe("base64-decode");
    });

    it("should handle empty string", async () => {
      const result = await Effect.runPromise(runTransform("", "base64-decode"));
      expect(result.result).toBe("");
    });

    it("should decode base64 without padding", async () => {
      const result = await Effect.runPromise(runTransform("aGVsbG8", "base64-decode"));
      expect(result.result).toBe("hello");
    });
  });

  describe("count transformation", () => {
    it("should return character count", async () => {
      const result = await Effect.runPromise(runTransform("hello", "count"));
      expect(result.result).toBe("5");
      expect(result.original).toBe("hello");
      expect(result.transformation).toBe("count");
    });

    it("should handle empty string", async () => {
      const result = await Effect.runPromise(runTransform("", "count"));
      expect(result.result).toBe("0");
    });

    it("should count spaces", async () => {
      const result = await Effect.runPromise(runTransform("hello world", "count"));
      expect(result.result).toBe("11");
    });
  });

  describe("result structure", () => {
    it("should include id, original, result, transformation, and timestamp", async () => {
      const result = await Effect.runPromise(runTransform("test", "uppercase"));

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("original");
      expect(result).toHaveProperty("result");
      expect(result).toHaveProperty("transformation");
      expect(result).toHaveProperty("timestamp");

      expect(typeof result.id).toBe("string");
      expect(result.id.length).toBeGreaterThan(0);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it("should generate unique ids", async () => {
      const result1 = await Effect.runPromise(runTransform("test", "uppercase"));
      const result2 = await Effect.runPromise(runTransform("test", "uppercase"));

      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe("TransformationError", () => {
    it("should have correct _tag", () => {
      const error = new TransformationError("test error");
      expect(error._tag).toBe("TransformationError");
      expect(error.message).toBe("test error");
    });

    it("should store cause", () => {
      const cause = new Error("original");
      const error = new TransformationError("wrapped error", cause);
      expect(error.cause).toBe(cause);
    });
  });
});
