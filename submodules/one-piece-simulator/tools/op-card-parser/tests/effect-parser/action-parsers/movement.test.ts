import { expect, test, describe } from "vite-plus/test";
import { parseActions } from "../../../src/effect-parser/index.ts";

describe("parseActions — returnToHand", () => {
  test("return up to 1 of your opponent's Characters with cost filter to hand", () => {
    const result = parseActions(
      "return up to 1 of your opponent's Characters with a cost of 5 or less to the owner's hand",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "returnToHand",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 5 }],
        },
      },
    ]);
  });

  test("return without player prefix defaults to opponent", () => {
    const result = parseActions(
      "return up to 1 Character with a cost of 3 or less to the owner's hand",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "returnToHand",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 3 }],
        },
      },
    ]);
  });

  test("return up to 2 Characters to hand", () => {
    const result = parseActions("return up to 2 of your opponent's Characters to the owner's hand");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "returnToHand",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 2, upTo: true },
        },
      },
    ]);
  });
});

describe("parseActions — returnToDeck", () => {
  test("place at bottom of owner's deck with cost filter", () => {
    const result = parseActions(
      "Place up to 1 of your opponent's Characters with a cost of 4 or less at the bottom of the owner's deck",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "returnToDeck",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 4 }],
        },
        position: "bottom",
      },
    ]);
  });

  test("place without player prefix defaults to opponent", () => {
    const result = parseActions(
      "Place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "returnToDeck",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 2 }],
        },
        position: "bottom",
      },
    ]);
  });

  test("place at top of owner's deck", () => {
    const result = parseActions(
      "Place up to 1 of your opponent's Characters at the top of the owner's deck",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "returnToDeck",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
        },
        position: "top",
      },
    ]);
  });
});

describe("parseActions — placeFromHandToDeck", () => {
  test("place 2 cards from hand at bottom of deck", () => {
    const result = parseActions(
      "place 2 cards from your hand at the bottom of your deck in any order",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "returnToDeck",
        target: {
          player: "self",
          zones: ["hand"],
          count: { amount: 2 },
        },
        position: "bottom",
      },
    ]);
  });

  test("place 2 cards from hand at top or bottom of deck", () => {
    const result = parseActions(
      "place 2 cards from your hand at the top or bottom of your deck in any order",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "returnToDeck",
        target: {
          player: "self",
          zones: ["hand"],
          count: { amount: 2 },
        },
        position: "any",
      },
    ]);
  });

  test("place 1 card from hand at top or bottom of deck (no 'in any order')", () => {
    const result = parseActions("place 1 card from your hand at the top or bottom of your deck");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "returnToDeck",
        target: {
          player: "self",
          zones: ["hand"],
          count: { amount: 1 },
        },
        position: "any",
      },
    ]);
  });
});

describe("parseActions — compound return to hand/deck", () => {
  test("return two groups to owner's hand", () => {
    const result = parseActions(
      "Return up to 1 Character with a cost of 8 or less and up to 1 Character with a cost of 3 or less to the owner's hand.",
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({
      action: "returnToHand",
      target: {
        zones: ["character"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "cost", comparison: "lte", value: 8 }],
      },
    });
    expect(result.parsed[1]).toMatchObject({
      action: "returnToHand",
      target: {
        zones: ["character"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "cost", comparison: "lte", value: 3 }],
      },
    });
  });

  test("place two groups at bottom of owner's deck", () => {
    const result = parseActions(
      "Place up to 1 of your opponent's Characters with a cost of 2 or less and up to 1 of your opponent's Characters with a cost of 5 or less at the bottom of the owner's deck.",
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({
      action: "returnToDeck",
      target: {
        player: "opponent",
        zones: ["character"],
        filters: [{ filter: "cost", comparison: "lte", value: 2 }],
      },
      position: "bottom",
    });
    expect(result.parsed[1]).toMatchObject({
      action: "returnToDeck",
      target: {
        player: "opponent",
        zones: ["character"],
        filters: [{ filter: "cost", comparison: "lte", value: 5 }],
      },
      position: "bottom",
    });
  });
});

describe("parseActions — returnToDeck with Return keyword", () => {
  test("return to bottom of owner's deck", () => {
    const result = parseActions(
      "Return up to 1 Character with a cost of 3 or less to the bottom of the owner's deck.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "returnToDeck",
      position: "bottom",
    });
  });
});

describe("parseAddFromTrashToHandAction", () => {
  test("Add up to 1 [Laboon] from your trash to your hand", () => {
    const result = parseActions("Add up to 1 [Laboon] from your trash to your hand.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "returnToHand",
      target: {
        player: "self",
        zones: ["trash"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "name", value: "Laboon" }],
      },
    });
  });

  test("add up to 2 Character cards with a cost of 4 or less from your trash to your hand", () => {
    const result = parseActions(
      "add up to 2 Character cards with a cost of 4 or less from your trash to your hand.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "returnToHand",
      target: {
        player: "self",
        zones: ["trash"],
        count: { amount: 2, upTo: true },
        filters: [
          { filter: "cardCategory", value: "character" },
          { filter: "cost", comparison: "lte", value: 4 },
        ],
      },
    });
  });
});
