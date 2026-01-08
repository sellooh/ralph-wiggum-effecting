import { Schema } from "effect";
import { describe, expect, it } from "vitest";
import { TransformRequest, TransformResult, TransformationType } from "./schemas";

describe("TransformationType", () => {
  it("should accept valid transformation types", () => {
    const validTypes = [
      "uppercase",
      "lowercase",
      "reverse",
      "base64-encode",
      "base64-decode",
      "count",
    ];

    for (const type of validTypes) {
      const result = Schema.decodeUnknownSync(TransformationType)(type);
      expect(result).toBe(type);
    }
  });

  it("should reject invalid transformation types", () => {
    const invalidTypes = ["UPPERCASE", "invalid", "", "base64", 123, null];

    for (const type of invalidTypes) {
      expect(() => Schema.decodeUnknownSync(TransformationType)(type)).toThrow();
    }
  });
});

describe("TransformRequest", () => {
  it("should accept valid requests", () => {
    const validRequest = {
      text: "hello world",
      transformation: "uppercase",
    };

    const result = Schema.decodeUnknownSync(TransformRequest)(validRequest);
    expect(result).toEqual(validRequest);
  });

  it("should accept empty text", () => {
    const request = {
      text: "",
      transformation: "lowercase",
    };

    const result = Schema.decodeUnknownSync(TransformRequest)(request);
    expect(result.text).toBe("");
  });

  it("should accept all transformation types", () => {
    const types = [
      "uppercase",
      "lowercase",
      "reverse",
      "base64-encode",
      "base64-decode",
      "count",
    ] as const;

    for (const transformation of types) {
      const request = { text: "test", transformation };
      const result = Schema.decodeUnknownSync(TransformRequest)(request);
      expect(result.transformation).toBe(transformation);
    }
  });

  it("should reject missing text field", () => {
    const invalid = { transformation: "uppercase" };
    expect(() => Schema.decodeUnknownSync(TransformRequest)(invalid)).toThrow();
  });

  it("should reject missing transformation field", () => {
    const invalid = { text: "hello" };
    expect(() => Schema.decodeUnknownSync(TransformRequest)(invalid)).toThrow();
  });

  it("should reject invalid transformation type", () => {
    const invalid = { text: "hello", transformation: "invalid" };
    expect(() => Schema.decodeUnknownSync(TransformRequest)(invalid)).toThrow();
  });

  it("should reject non-string text", () => {
    const invalid = { text: 123, transformation: "uppercase" };
    expect(() => Schema.decodeUnknownSync(TransformRequest)(invalid)).toThrow();
  });
});

describe("TransformResult", () => {
  it("should accept valid results", () => {
    const timestamp = new Date();
    const validResult = {
      id: "abc-123",
      original: "hello",
      result: "HELLO",
      transformation: "uppercase",
      timestamp,
    };

    const result = Schema.decodeUnknownSync(TransformResult)(validResult);
    expect(result).toEqual(validResult);
  });

  it("should accept all transformation types in result", () => {
    const types = [
      "uppercase",
      "lowercase",
      "reverse",
      "base64-encode",
      "base64-decode",
      "count",
    ] as const;

    for (const transformation of types) {
      const validResult = {
        id: "test-id",
        original: "test",
        result: "TEST",
        transformation,
        timestamp: new Date(),
      };
      const result = Schema.decodeUnknownSync(TransformResult)(validResult);
      expect(result.transformation).toBe(transformation);
    }
  });

  it("should reject missing id field", () => {
    const invalid = {
      original: "hello",
      result: "HELLO",
      transformation: "uppercase",
      timestamp: new Date(),
    };
    expect(() => Schema.decodeUnknownSync(TransformResult)(invalid)).toThrow();
  });

  it("should reject missing original field", () => {
    const invalid = {
      id: "abc-123",
      result: "HELLO",
      transformation: "uppercase",
      timestamp: new Date(),
    };
    expect(() => Schema.decodeUnknownSync(TransformResult)(invalid)).toThrow();
  });

  it("should reject missing result field", () => {
    const invalid = {
      id: "abc-123",
      original: "hello",
      transformation: "uppercase",
      timestamp: new Date(),
    };
    expect(() => Schema.decodeUnknownSync(TransformResult)(invalid)).toThrow();
  });

  it("should reject missing transformation field", () => {
    const invalid = {
      id: "abc-123",
      original: "hello",
      result: "HELLO",
      timestamp: new Date(),
    };
    expect(() => Schema.decodeUnknownSync(TransformResult)(invalid)).toThrow();
  });

  it("should reject missing timestamp field", () => {
    const invalid = {
      id: "abc-123",
      original: "hello",
      result: "HELLO",
      transformation: "uppercase",
    };
    expect(() => Schema.decodeUnknownSync(TransformResult)(invalid)).toThrow();
  });

  it("should reject invalid timestamp type", () => {
    const invalid = {
      id: "abc-123",
      original: "hello",
      result: "HELLO",
      transformation: "uppercase",
      timestamp: "2024-01-01",
    };
    expect(() => Schema.decodeUnknownSync(TransformResult)(invalid)).toThrow();
  });

  it("should reject invalid id type", () => {
    const invalid = {
      id: 123,
      original: "hello",
      result: "HELLO",
      transformation: "uppercase",
      timestamp: new Date(),
    };
    expect(() => Schema.decodeUnknownSync(TransformResult)(invalid)).toThrow();
  });
});
