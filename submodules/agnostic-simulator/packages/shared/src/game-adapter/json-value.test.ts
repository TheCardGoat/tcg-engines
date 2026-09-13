import { describe, expect, it } from "vitest";
import { isJsonValue, parseJsonValue } from "./types.ts";

describe("JSON-safe game adapter values", () => {
  it("accepts nested plain data without coercion", () => {
    const value = { schemaVersion: 1, cards: [{ id: "card-1", quantity: 3 }] };

    expect(parseJsonValue(value)).toBe(value);
  });

  it.each([
    ["function", { ability: () => null }],
    ["undefined", { missing: undefined }],
    ["map", new Map([["card-1", 1]])],
    ["set", new Set(["card-1"])],
    ["non-finite number", Number.NaN],
  ])("rejects %s values that JSON would lose or change", (_label, value) => {
    expect(isJsonValue(value)).toBe(false);
    expect(() => parseJsonValue(value)).toThrow("losslessly JSON-serializable");
  });

  it("rejects sparse arrays that JSON would fill with null", () => {
    const sparse = new Array(1);

    expect(isJsonValue(sparse)).toBe(false);
    expect(() => parseJsonValue(sparse)).toThrow("losslessly JSON-serializable");
  });

  it("rejects array properties that JSON would omit", () => {
    const extended = ["card"] as string[] & { note?: string };
    extended.note = "not serialized";

    expect(isJsonValue(extended)).toBe(false);
    expect(() => parseJsonValue(extended)).toThrow("losslessly JSON-serializable");
  });
});
