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

  test("return without player prefix can target either player's Character", () => {
    const result = parseActions(
      "return up to 1 Character with a cost of 3 or less to the owner's hand",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "returnToHand",
        target: {
          player: "any",
          zones: ["character"],
          count: { amount: 1, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 3 }],
        },
      },
    ]);
  });

  test("return without player prefix excludes the effect source when printed", () => {
    const result = parseActions(
      "return up to 1 Character with a cost of 1 or less other than this Character to the owner's hand",
    );

    expect(result).toEqual({
      parsed: [
        {
          action: "returnToHand",
          target: {
            player: "any",
            zones: ["character"],
            count: { amount: 1, upTo: true },
            filters: [{ filter: "cost", comparison: "lte", value: 1 }, { filter: "excludeSelf" }],
          },
        },
      ],
      unparsed: "",
    });
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

  test("schedules this Character's return for the end of the turn", () => {
    const result = parseActions(
      "return this Character to the owner's hand at the end of this turn",
    );

    expect(result).toEqual({
      parsed: [
        {
          action: "delayed",
          timing: "endOfThisTurn",
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
            },
          ],
        },
      ],
      unparsed: "",
    });
  });
});

describe("parseActions — returnToDeck", () => {
  test("retains an opponent-trash return after their hand discard", () => {
    const result = parseActions(
      "Your opponent trashes 1 card from their hand. Then, you may place up to 1 card from your opponent's trash at the bottom of their deck.",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      { action: "trashFromHand", player: "opponent", amount: 1 },
      {
        action: "returnToDeck",
        target: {
          player: "opponent",
          zones: ["trash"],
          count: { amount: 1, upTo: true },
          chosenBy: "self",
        },
        position: "bottom",
      },
    ]);
  });

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

  test("place without player prefix can target either player's Character", () => {
    const result = parseActions(
      "Place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "returnToDeck",
        target: {
          player: "any",
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
        order: "any",
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
        order: "any",
      },
    ]);
  });

  test("routes an opponent hand-bottom choice to the opponent", () => {
    const result = parseActions(
      "your opponent places 2 cards from their hand at the bottom of their deck in any order",
    );
    expect(result).toEqual({
      parsed: [
        {
          action: "returnToDeck",
          target: {
            player: "opponent",
            zones: ["hand"],
            count: { amount: 2 },
            chosenBy: "opponent",
          },
          position: "bottom",
          order: "any",
        },
      ],
      unparsed: "",
    });
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
        player: "any",
        zones: ["character"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "cost", comparison: "lte", value: 8 }],
      },
    });
    expect(result.parsed[1]).toMatchObject({
      action: "returnToHand",
      target: {
        player: "any",
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

  test('suffix trait plus "and a cost" composes every trash-to-hand filter', () => {
    const result = parseActions(
      'Add up to 1 Character card with a type including "Baroque Works" and a cost of 8 or less from your trash to your hand.',
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "returnToHand",
        target: {
          player: "self",
          zones: ["trash"],
          count: { amount: 1, upTo: true },
          filters: [
            { filter: "cardCategory", value: "character" },
            { filter: "trait", value: "Baroque Works", match: "includes" },
            { filter: "cost", comparison: "lte", value: 8 },
          ],
        },
      },
    ]);
  });

  test("quoted trait trash recovery uses inclusive matching", () => {
    const result = parseActions(
      'Add up to 1 "Straw Hat Crew" type Character card other than [Tony Tony.Chopper] with a cost of 4 or less from your trash to your hand.',
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "returnToHand",
        target: {
          player: "self",
          zones: ["trash"],
          count: { amount: 1, upTo: true },
          filters: [
            { filter: "trait", value: "Straw Hat Crew", match: "includes" },
            { filter: "cardCategory", value: "character" },
            { filter: "excludeName", value: "Tony Tony.Chopper" },
            { filter: "cost", comparison: "lte", value: 4 },
          ],
        },
      },
    ]);
  });

  test("quoted trait-only trash recovery preserves its cost filter", () => {
    const result = parseActions(
      'Add up to 1 "SMILE" type card with a cost of 5 or less from your trash to your hand.',
    );

    expect(result).toEqual({
      parsed: [
        {
          action: "returnToHand",
          target: {
            player: "self",
            zones: ["trash"],
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "trait", value: "SMILE", match: "includes" },
              { filter: "cost", comparison: "lte", value: 5 },
            ],
          },
        },
      ],
      unparsed: "",
    });
  });
});

describe("parseReturnToDeckAction — typed opponent trash", () => {
  test("lets the opponent choose exactly three Events and order them on deck bottom", () => {
    const result = parseActions(
      "Your opponent places 3 Events from their trash at the bottom of their deck in any order.",
    );

    expect(result).toEqual({
      parsed: [
        {
          action: "returnToDeck",
          target: {
            player: "opponent",
            zones: ["trash"],
            count: { amount: 3 },
            filters: [{ filter: "cardCategory", value: "event" }],
            chosenBy: "opponent",
          },
          position: "bottom",
          order: "any",
        },
      ],
      unparsed: "",
    });
  });
});
