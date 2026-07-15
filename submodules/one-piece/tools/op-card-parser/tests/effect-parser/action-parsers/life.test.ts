import { expect, test, describe } from "vite-plus/test";
import { parseActions } from "../../../src/effect-parser/index.ts";

describe("parseActions — setActive", () => {
  test("set up to 1 of your DON!! cards as active", () => {
    const result = parseActions("set up to 1 of your DON!! cards as active");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "setActive",
        target: {
          player: "self",
          zones: ["costArea"],
          count: { amount: 1, upTo: true },
        },
      },
    ]);
  });

  test("set this Character as active", () => {
    const result = parseActions("set this Character as active");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "setActive",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          self: true,
        },
      },
    ]);
  });

  test("set your Leader as active", () => {
    const result = parseActions("set your Leader as active");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "setActive",
        target: { player: "self", zones: ["leader"], count: { amount: 1 } },
      },
    ]);
  });

  test("set up to 2 of your DON!! cards as active", () => {
    const result = parseActions("set up to 2 of your DON!! cards as active");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "setActive",
        target: {
          player: "self",
          zones: ["costArea"],
          count: { amount: 2, upTo: true },
        },
      },
    ]);
  });
});

// ── Add to Life action tests ──

describe("parseActions — addToLife", () => {
  test("add up to 1 card from top of deck to top of Life", () => {
    const result = parseActions(
      "add up to 1 card from the top of your deck to the top of your Life cards",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "addToLife",
        target: {
          player: "self",
          zones: ["deck"],
          count: { amount: 1, upTo: true },
        },
        position: "top",
      },
    ]);
  });

  test("add up to 1 card to bottom of Life", () => {
    const result = parseActions(
      "add up to 1 card from the top of your deck to the bottom of your Life cards",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "addToLife",
        target: {
          player: "self",
          zones: ["deck"],
          count: { amount: 1, upTo: true },
        },
        position: "bottom",
      },
    ]);
  });

  test("add up to 2 cards to top of Life", () => {
    const result = parseActions(
      "add up to 2 cards from the top of your deck to the top of your Life cards",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "addToLife",
        target: {
          player: "self",
          zones: ["deck"],
          count: { amount: 2, upTo: true },
        },
        position: "top",
      },
    ]);
  });
});

// ── RemoveFromLife action tests ──

describe("parseActions — removeFromLife", () => {
  test("add 1 card from life to hand", () => {
    const result = parseActions("add 1 card from the top of your Life cards to your hand");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "removeFromLife",
        player: "self",
        count: { amount: 1 },
        destination: "hand",
      },
    ]);
  });

  test("trash up to 1 card from opponent's life", () => {
    const result = parseActions("trash up to 1 card from the top of your opponent's Life cards");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "removeFromLife",
        player: "opponent",
        count: { amount: 1, upTo: true },
        destination: "trash",
      },
    ]);
  });

  test("Trash up to 1 card from opponent's life (capitalized)", () => {
    const result = parseActions("Trash up to 1 card from the top of your opponent's Life cards");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "removeFromLife",
        player: "opponent",
        count: { amount: 1, upTo: true },
        destination: "trash",
      },
    ]);
  });

  test("trash 1 card from your own life (no up to)", () => {
    const result = parseActions("trash 1 card from the top of your Life cards");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "removeFromLife",
        player: "self",
        count: { amount: 1 },
        destination: "trash",
      },
    ]);
  });
});
