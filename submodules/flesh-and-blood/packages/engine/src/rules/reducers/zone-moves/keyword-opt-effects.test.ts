import { describe, expect, it } from "vite-plus/test";

import { keywordEffectsFromPrintedKeywords } from "./helpers.ts";

describe("keywordEffectsFromPrintedKeywords opt", () => {
  it("synthesizes Opt when the authored resolution has no opt leaf", () => {
    expect(keywordEffectsFromPrintedKeywords([{ name: "opt", value: 2 }])).toEqual([
      { type: "opt", count: 2 },
    ]);
  });

  it("does not synthesize a trailing Opt when the resolution AST already opts", () => {
    expect(
      keywordEffectsFromPrintedKeywords([{ name: "opt", value: 1 }], [{ type: "opt", count: 1 }]),
    ).toEqual([]);
  });
});
