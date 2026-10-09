import { describe, expect, test } from "vite-plus/test";
import { parseActions } from "../../src/effect-parser/action-parsers/index.ts";

describe("single-instruction grouped active play", () => {
  test("collects both EB03-049 groups from the shared hand or trash pool", () => {
    const result = parseActions(
      "play up to 1 {Thriller Bark Pirates} type Character card with a cost of 6 or less and up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your hand or trash",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      expect.objectContaining({
        action: "playGrouped",
        source: { player: "self", zone: ["hand", "trash"] },
        groups: [
          expect.objectContaining({
            filters: expect.arrayContaining([{ filter: "cost", comparison: "lte", value: 6 }]),
          }),
          expect.objectContaining({
            filters: expect.arrayContaining([{ filter: "cost", comparison: "lte", value: 4 }]),
          }),
        ],
        playStates: { single: "active", multiple: ["active", "active"] },
      }),
    ]);
  });

  test("collects all three OP16-105 names with the shared cost limit", () => {
    const result = parseActions(
      "play up to 1 [Absalom], up to 1 [Dr. Hogback], and up to 1 [Perona], with a cost of 4 or less from your trash",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      expect.objectContaining({
        action: "playGrouped",
        source: { player: "self", zone: "trash" },
        groups: ["Absalom", "Dr. Hogback", "Perona"].map((value) => ({
          count: { amount: 1, upTo: true },
          filters: expect.arrayContaining([
            { filter: "name", value },
            { filter: "cost", comparison: "lte", value: 4 },
          ]),
        })),
        playStates: { single: "active", multiple: ["active", "active", "active"] },
      }),
    ]);
  });

  test("keeps separately stated play instructions sequential", () => {
    const result = parseActions(
      "play up to 1 [Absalom] from your trash. Then, play up to 1 [Perona] from your trash",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed.map((action) => action.action)).toEqual(["play", "play"]);
  });

  test("preserves grouped play before a separate Then action", () => {
    const result = parseActions(
      "Play up to 1 [Absalom] and up to 1 [Perona] from your trash. Then, draw 1 card.",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed.map((action) => action.action)).toEqual(["playGrouped", "draw"]);
    expect(result.parsed[1]).toEqual({ action: "draw", player: "self", amount: 1 });
  });
});
