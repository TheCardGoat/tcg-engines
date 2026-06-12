import { describe, expect, test } from "bun:test";

import { decodeDeckFromUrlParam, encodeDeckToUrlParam } from "./deck-codec.js";

describe("deck-codec", () => {
  test("round-trips ASCII deck text", () => {
    const deck = "4 Mickey Mouse - True Friend\n3 Stitch - Carefree Surfer";
    const encoded = encodeDeckToUrlParam(deck);
    expect(encoded).not.toContain("+");
    expect(encoded).not.toContain("/");
    expect(encoded).not.toContain("=");
    expect(decodeDeckFromUrlParam(encoded)).toBe(deck);
  });

  test("round-trips utf-8 deck text", () => {
    const deck = "4 ミッキー — 真の友\n3 スティッチ";
    expect(decodeDeckFromUrlParam(encodeDeckToUrlParam(deck))).toBe(deck);
  });

  test("returns null for invalid base64url", () => {
    expect(decodeDeckFromUrlParam("not!valid!")).toBeNull();
  });

  test("returns null for nullish or empty input", () => {
    expect(decodeDeckFromUrlParam(null)).toBeNull();
    expect(decodeDeckFromUrlParam(undefined)).toBeNull();
    expect(decodeDeckFromUrlParam("")).toBeNull();
  });

  test("accepts URLSearchParams.get() return type directly", () => {
    const params = new URLSearchParams("deck=" + encodeDeckToUrlParam("4 Foo"));
    expect(decodeDeckFromUrlParam(params.get("deck"))).toBe("4 Foo");
    expect(decodeDeckFromUrlParam(params.get("missing"))).toBeNull();
  });
});
