import { expect, test, describe } from "vite-plus/test";
import { buildCardEffects, parseActions } from "../../../src/effect-parser/index.ts";

describe("parseActions — addToLife from hand", () => {
  test("included trait with an exact cost", () => {
    const result = parseActions(
      'Add up to 1 "Supernovas" type Character card with a cost of 5 from your hand to the top of your Life cards face-up.',
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "addToLife",
        target: {
          player: "self",
          zones: ["hand"],
          count: { amount: 1, upTo: true },
          filters: [
            { filter: "trait", value: "Supernovas", match: "includes" },
            { filter: "cardCategory", value: "character" },
            { filter: "cost", comparison: "eq", value: 5 },
          ],
        },
        position: "top",
        faceUp: true,
      },
    ]);
  });

  test("keeps an On Play clause after a standalone Blocker keyword", () => {
    const effects = buildCardEffects(
      '[Blocker]\n[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 "Supernovas" type Character card with a cost of 5 from your hand to the top of your Life cards face-up.',
    );

    expect(effects?.keywords).toEqual(["blocker"]);
    expect(effects?.effects).toHaveLength(1);
    expect(effects?.effects?.[0]).toMatchObject({
      trigger: "onPlay",
      optional: true,
      costs: [{ cost: "addLifeToHand", amount: 1, position: "choice" }],
    });
  });
});

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

  test("set an included-type Leader as active", () => {
    const result = parseActions("set your {Land of Wano} type Leader as active");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "setActive",
        target: {
          player: "self",
          zones: ["leader"],
          count: { amount: 1 },
          filters: [{ filter: "trait", value: "Land of Wano", match: "includes" }],
        },
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

// ── Life look action tests ──

describe("parseActions — lookAtLife", () => {
  test("preserves the optional either-player top-Life choice", () => {
    const result = parseActions(
      "Look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards.",
    );

    expect(result).toEqual({
      parsed: [
        {
          action: "lookAtLife",
          player: "either",
          position: "topOrBottom",
          upTo: true,
        },
      ],
      unparsed: "",
    });
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

  test("delays a deck-to-Life action until the end of this turn", () => {
    const result = parseActions(
      "add 1 card from the top of your deck to the top of your Life cards at the end of this turn",
    );

    expect(result).toEqual({
      parsed: [
        {
          action: "delayed",
          timing: "endOfThisTurn",
          actions: [
            {
              action: "addToLife",
              target: {
                player: "self",
                zones: ["deck"],
                count: { amount: 1 },
              },
              position: "top",
            },
          ],
        },
      ],
      unparsed: "",
    });
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
        position: "top",
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

describe("parseActions — Life ownership and placement", () => {
  test("looks at up to one top Life card from either player and chooses its position", () => {
    const result = parseActions(
      "Look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards.",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "lookAtLife",
        player: "either",
        position: "topOrBottom",
        upTo: true,
      },
    ]);
  });

  test("does not represent looking at two Life cards as the one-card action", () => {
    const text =
      "Look at up to 2 cards from the top of your or your opponent's Life cards, and place them at the top or bottom of the Life cards.";
    const result = parseActions(text);

    expect(result.parsed).toEqual([]);
    expect(result.unparsed).toBe(
      "Look at up to 2 cards from the top of your or your opponent's Life cards and place them at the top or bottom of the Life cards",
    );
  });

  test("adds any eligible Character to its owner's chosen Life position face-up", () => {
    const result = parseActions(
      "Add up to 1 Character with a cost of 8 or less to the top or bottom of the owner's Life cards face-up.",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "addToLife",
        target: {
          player: "any",
          zones: ["character"],
          count: { amount: 1, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 8 }],
        },
        position: "choice",
        faceUp: true,
      },
    ]);
  });

  test("adds an opposing Character matching either inclusive trait to Life", () => {
    const result = parseActions(
      "Add up to 1 of your opponent's [Animal] or [SMILE] type Characters with a cost of 3 or less to the top of your opponent's Life cards face-up.",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "addToLife",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
          filters: [
            { filter: "cost", comparison: "lte", value: 3 },
            {
              filter: "anyOf",
              filters: [
                { filter: "trait", value: "Animal", match: "includes" },
                { filter: "trait", value: "SMILE", match: "includes" },
              ],
            },
          ],
        },
        position: "top",
        faceUp: true,
      },
    ]);
  });
});
