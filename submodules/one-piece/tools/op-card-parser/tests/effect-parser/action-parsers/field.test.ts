import { expect, test, describe } from "vite-plus/test";
import {
  parseActions,
  buildCardEffects,
  parseEffectText,
} from "../../../src/effect-parser/index.ts";

describe("parseActions — RestAction", () => {
  test("parses 'Rest up to 1 of your opponent's Characters'", () => {
    const result = parseActions("Rest up to 1 of your opponent's Characters");
    expect(result.parsed).toEqual([
      {
        action: "rest",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
        },
      },
    ]);
    expect(result.unparsed).toBe("");
  });

  test("parses rest with cost filter", () => {
    const result = parseActions(
      "Rest up to 1 of your opponent's Characters with a cost of 5 or less",
    );
    expect(result.parsed).toEqual([
      {
        action: "rest",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 5 }],
        },
      },
    ]);
    expect(result.unparsed).toBe("");
  });

  test("parses rest with base cost filter", () => {
    const result = parseActions(
      "Rest up to 1 of your opponent's Characters with a base cost of 6 or less",
    );
    expect(result.parsed[0]).toMatchObject({
      action: "rest",
      target: {
        filters: [{ filter: "baseCost", comparison: "lte", value: 6 }],
      },
    });
  });

  test("parses rest DON!! cards", () => {
    const result = parseActions("Rest up to 1 of your opponent's DON!! cards");
    expect(result.parsed).toEqual([
      {
        action: "rest",
        target: {
          player: "opponent",
          zones: ["costArea"],
          count: { amount: 1, upTo: true },
        },
      },
    ]);
  });

  test("parses rest Leader or Character cards", () => {
    const result = parseActions("Rest up to 1 of your opponent's Leader or Character cards");
    expect(result.parsed[0]).toMatchObject({
      action: "rest",
      target: { zones: ["leader", "character"] },
    });
  });

  test("parses rest this Character", () => {
    const result = parseActions("rest this Character");
    expect(result.parsed).toEqual([
      {
        action: "rest",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          self: true,
        },
      },
    ]);
  });

  describe("real card integration", () => {
    test("OP01-033 Izo: '[On Play] Rest up to 1 ... cost of 4 or less'", () => {
      const parsed = parseEffectText(
        "[On Play] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
      );
      const actions = parseActions(parsed.segments[0]!.rawActionText);
      expect(actions.parsed).toEqual([
        {
          action: "rest",
          target: {
            player: "opponent",
            zones: ["character"],
            count: { amount: 1, upTo: true },
            filters: [{ filter: "cost", comparison: "lte", value: 4 }],
          },
        },
      ]);
      expect(actions.unparsed).toBe("");
    });

    test("OP13-033 Franky: '[On K.O.] Rest up to 2 of your opponent's cards'", () => {
      const parsed = parseEffectText("[On K.O.] Rest up to 2 of your opponent's cards.");
      const actions = parseActions(parsed.segments[0]!.rawActionText);
      expect(actions.parsed[0]).toMatchObject({
        action: "rest",
        target: {
          player: "opponent",
          zones: ["leader", "character", "stage", "costArea"],
          count: { amount: 2, upTo: true },
        },
      });
    });

    test("OP06-112 Raizo: rest DON!! after cost clause", () => {
      // Full text: "[When Attacking] You may trash 1 card from your hand: Rest up to 1 of your opponent's DON!! cards."
      // After prefix parsing, rawActionText = "Rest up to 1 of your opponent's DON!! cards"
      const result = parseActions("Rest up to 1 of your opponent's DON!! cards");
      expect(result.parsed[0]).toMatchObject({
        action: "rest",
        target: { zones: ["costArea"] },
      });
    });

    test("OP06-075 Count Battler: rest 2 Characters with cost 2 or less", () => {
      const result = parseActions(
        "Rest up to 2 of your opponent's Characters with a cost of 2 or less",
      );
      expect(result.parsed[0]).toMatchObject({
        action: "rest",
        target: {
          count: { amount: 2, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 2 }],
        },
      });
    });

    test("OP06-035 Hody Jones: compound rest + remove from life", () => {
      const result = parseActions(
        "Rest up to a total of 2 of your opponent's Characters or DON!! cards. Then, add 1 card from the top of your Life cards to your hand",
      );
      expect(result.unparsed).toBe("");
      expect(result.parsed).toHaveLength(2);
      expect(result.parsed[0]).toMatchObject({
        action: "rest",
        target: {
          zones: ["character", "costArea"],
          count: { amount: 2, upTo: true },
        },
      });
      expect(result.parsed[1]).toMatchObject({
        action: "removeFromLife",
        player: "self",
        count: { amount: 1 },
        destination: "hand",
      });
    });

    test("OP14EB04-027 Shanks: rest with base power filter", () => {
      const result = parseActions(
        "rest up to 1 of your opponent's Characters with 7000 base power or less",
      );
      expect(result.parsed[0]).toMatchObject({
        action: "rest",
        target: {
          filters: [{ filter: "basePower", comparison: "lte", value: 7000 }],
        },
      });
    });

    test("compound: draw + rest", () => {
      const result = parseActions(
        "draw 1 card and rest up to 1 of your opponent's Characters with 7000 base power or less",
      );
      expect(result.parsed).toHaveLength(2);
      expect(result.parsed[0]).toEqual({ action: "draw", player: "self", amount: 1 });
      expect(result.parsed[1]).toMatchObject({
        action: "rest",
        target: { filters: [{ filter: "basePower", comparison: "lte", value: 7000 }] },
      });
      expect(result.unparsed).toBe("");
    });

    test("OP12-031 Tashigi: rest with base cost filter", () => {
      const result = parseActions(
        "Rest up to 1 of your opponent's Characters with a base cost of 6 or less",
      );
      expect(result.parsed[0]).toMatchObject({
        action: "rest",
        target: {
          filters: [{ filter: "baseCost", comparison: "lte", value: 6 }],
        },
      });
    });

    test("OP14EB04-090 Mr.1: rest with exact cost", () => {
      const result = parseActions("Rest up to 1 of your opponent's Characters with a cost of 0");
      expect(result.parsed[0]).toMatchObject({
        action: "rest",
        target: {
          filters: [{ filter: "cost", comparison: "eq", value: 0 }],
        },
      });
    });
  });
});

describe("parseActions — KoAction", () => {
  test("parses simple K.O. with cost filter", () => {
    const result = parseActions(
      "K.O. up to 1 of your opponent's Characters with a cost of 5 or less",
    );
    expect(result.parsed).toEqual([
      {
        action: "ko",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 5 }],
        },
      },
    ]);
    expect(result.unparsed).toBe("");
  });

  test("parses K.O. with no filter", () => {
    const result = parseActions("K.O. up to 1 of your opponent's Characters");
    expect(result.parsed).toEqual([
      {
        action: "ko",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
        },
      },
    ]);
  });

  test("parses K.O. with power filter", () => {
    const result = parseActions(
      "K.O. up to 1 of your opponent's Characters with 3000 power or less",
    );
    expect(result.parsed[0]).toMatchObject({
      action: "ko",
      target: {
        filters: [{ filter: "power", comparison: "lte", value: 3000 }],
      },
    });
  });

  test("parses K.O. with exact power filter (0 power)", () => {
    const result = parseActions("K.O. up to 1 of your opponent's Characters with 0 power or less");
    expect(result.parsed[0]).toMatchObject({
      action: "ko",
      target: {
        filters: [{ filter: "power", comparison: "lte", value: 0 }],
      },
    });
  });

  test("parses K.O. with base power filter", () => {
    const result = parseActions(
      "K.O. up to 1 of your opponent's Characters with 3000 base power or less",
    );
    expect(result.parsed[0]).toMatchObject({
      action: "ko",
      target: {
        filters: [{ filter: "basePower", comparison: "lte", value: 3000 }],
      },
    });
  });

  test("parses K.O. with base cost filter", () => {
    const result = parseActions(
      "K.O. up to 2 of your opponent's Characters with a base cost of 3 or less",
    );
    expect(result.parsed[0]).toMatchObject({
      action: "ko",
      target: {
        count: { amount: 2, upTo: true },
        filters: [{ filter: "baseCost", comparison: "lte", value: 3 }],
      },
    });
  });

  test("parses K.O. rested Characters", () => {
    const result = parseActions(
      "K.O. up to 1 of your opponent's rested Characters with a cost of 4 or less",
    );
    expect(result.parsed[0]).toMatchObject({
      action: "ko",
      target: {
        filters: [
          { filter: "state", value: "rested" },
          { filter: "cost", comparison: "lte", value: 4 },
        ],
      },
    });
  });

  test("parses K.O. Stages", () => {
    const result = parseActions("K.O. up to 1 of your opponent's Stages with a cost of 7");
    expect(result.parsed[0]).toMatchObject({
      action: "ko",
      target: {
        zones: ["stage"],
        filters: [{ filter: "cost", comparison: "eq", value: 7 }],
      },
    });
  });

  test("parses K.O. with alternate base power format", () => {
    const result = parseActions(
      "K.O. up to 1 of your opponent's Characters with a base power of 6000 or less",
    );
    expect(result.parsed[0]).toMatchObject({
      action: "ko",
      target: {
        filters: [{ filter: "basePower", comparison: "lte", value: 6000 }],
      },
    });
  });

  describe("real card integration", () => {
    test("OP13-013 Higuma: simple K.O. with 0 power", () => {
      const parsed = parseEffectText(
        "[On Play] K.O. up to 1 of your opponent's Characters with 0 power or less.",
      );
      expect(parsed.segments).toHaveLength(1);
      expect(parsed.segments[0]!.triggers).toEqual(["onPlay"]);
      const actions = parseActions(parsed.segments[0]!.rawActionText);
      expect(actions.parsed).toEqual([
        {
          action: "ko",
          target: {
            player: "opponent",
            zones: ["character"],
            count: { amount: 1, upTo: true },
            filters: [{ filter: "power", comparison: "lte", value: 0 }],
          },
        },
      ]);
      expect(actions.unparsed).toBe("");
    });

    test("EB01-049 T-Bone: K.O. with cost 2 or less", () => {
      const parsed = parseEffectText(
        "[On Play] K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
      );
      const actions = parseActions(parsed.segments[0]!.rawActionText);
      expect(actions.parsed[0]).toMatchObject({
        action: "ko",
        target: { filters: [{ filter: "cost", comparison: "lte", value: 2 }] },
      });
    });

    test("OP03-034 Buchi: K.O. rested Characters", () => {
      const parsed = parseEffectText(
        "[On Play] K.O. up to 1 of your opponent's rested Characters with a cost of 2 or less.",
      );
      const actions = parseActions(parsed.segments[0]!.rawActionText);
      expect(actions.parsed[0]).toMatchObject({
        action: "ko",
        target: {
          filters: [
            { filter: "state", value: "rested" },
            { filter: "cost", comparison: "lte", value: 2 },
          ],
        },
      });
    });

    test("OP14EB04-033 Groggy Monsters: K.O. with base power", () => {
      const parsed = parseEffectText(
        "[On Play] DON!! 1: If you have 3 or more {Foxy Pirates} type Characters, K.O. up to 1 of your opponent's Characters with 6000 base power or less.",
      );
      const seg = parsed.segments[0]!;
      expect(seg.triggers).toEqual(["onPlay"]);
      expect(seg.costs).toEqual([{ type: "returnDon", amount: 1 }]);
      const actions = parseActions(seg.rawActionText);
      // "If you have..." prefix prevents K.O. from parsing as standalone
      // The K.O. clause is inside a conditional
      expect(actions.unparsed).toContain("K.O.");
    });

    test("EB01-037 Mr.9: K.O. after cost prefix", () => {
      const parsed = parseEffectText(
        "[On Your Opponent's Attack] [Once Per Turn] DON!! -1: K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
      );
      const seg = parsed.segments[0]!;
      expect(seg.triggers).toEqual(["onOpponentAttack"]);
      expect(seg.oncePerTurn).toBe(true);
      expect(seg.costs).toEqual([{ type: "returnDon", amount: 1 }]);
      const actions = parseActions(seg.rawActionText);
      expect(actions.parsed[0]).toMatchObject({
        action: "ko",
        target: { filters: [{ filter: "cost", comparison: "lte", value: 2 }] },
      });
    });

    test("EB03-036 Baby 5: K.O. 2 characters with base cost", () => {
      const parsed = parseEffectText(
        "[On Play] DON!! 1: K.O. up to 2 of your opponent's Characters with a base cost of 3 or less.",
      );
      const actions = parseActions(parsed.segments[0]!.rawActionText);
      expect(actions.parsed[0]).toMatchObject({
        action: "ko",
        target: {
          count: { amount: 2, upTo: true },
          filters: [{ filter: "baseCost", comparison: "lte", value: 3 }],
        },
      });
    });

    test("OP14EB04-088 Miss Merrychristmas: K.O. Stage with exact cost", () => {
      const parsed = parseEffectText(
        "[On K.O.] If your Leader's type includes \"Baroque Works\", draw 1 card and K.O. up to 1 of your opponent's Stages with a cost of 1.",
      );
      const seg = parsed.segments[0]!;
      expect(seg.triggers).toEqual(["onKo"]);
      const actions = parseActions(seg.rawActionText);
      // "If your Leader's type..." prefix blocks parsing, but k.o. clause is after "and"
      expect(actions.parsed[0]).toMatchObject({
        action: "ko",
        target: {
          zones: ["stage"],
          filters: [{ filter: "cost", comparison: "eq", value: 1 }],
        },
      });
    });

    test("compound: K.O. and draw", () => {
      const result = parseActions(
        "K.O. up to 1 of your opponent's Characters with a cost of 3 or less and draw 1 card",
      );
      expect(result.parsed).toHaveLength(2);
      expect(result.parsed[0]).toMatchObject({ action: "ko" });
      expect(result.parsed[1]).toEqual({ action: "draw", player: "self", amount: 1 });
      expect(result.unparsed).toBe("");
    });

    test("compound: rest and K.O.", () => {
      const result = parseActions(
        "rest up to 1 of your opponent's Characters and K.O. up to 1 of your opponent's Characters with a cost of 2 or less",
      );
      expect(result.parsed).toHaveLength(2);
      expect(result.parsed[0]).toMatchObject({ action: "rest" });
      expect(result.parsed[1]).toMatchObject({ action: "ko" });
      expect(result.unparsed).toBe("");
    });
  });
});

describe("TrashFromField", () => {
  test("Trash up to 1 of your opponent's Characters with 6000 power or less", () => {
    const result = parseActions(
      "Trash up to 1 of your opponent's Characters with 6000 power or less",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toEqual({
      action: "trashFromField",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "power", comparison: "lte", value: 6000 }],
      },
    });
  });

  test("does not match trash from hand patterns", () => {
    const result = parseActions("trash 2 cards from your hand");
    expect(result.parsed[0]).toMatchObject({ action: "trashFromHand" });
  });
});

describe("compound actions", () => {
  test("trash from hand and draw", () => {
    const result = parseActions("trash 2 cards from your hand and draw 2 cards");
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({ action: "trashFromHand", amount: 2 });
    expect(result.parsed[1]).toMatchObject({ action: "draw", amount: 2 });
  });

  test("draw and trash from hand (Then separator)", () => {
    const result = parseActions("draw 1 card. Then, trash 1 card from your hand");
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({ action: "draw", amount: 1 });
    expect(result.parsed[1]).toMatchObject({ action: "trashFromHand", amount: 1 });
  });
});

describe("real card integration", () => {
  test("[On Play] trash 2 cards from hand: draw 2 cards", () => {
    const result = buildCardEffects(
      "[On Play] You may trash 2 cards from your hand: Draw 2 cards.",
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("onPlay");
    expect(block.optional).toBe(true);
    expect(block.costs).toEqual([{ cost: "trashFromHand", amount: 2 }]);
    expect(block.actions).toEqual([{ action: "draw", player: "self", amount: 2 }]);
  });

  test("[On Play] Trash up to 1 of opponent's Characters with power filter", () => {
    const result = buildCardEffects(
      "[On Play] Trash up to 1 of your opponent's Characters with 6000 power or less.",
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("onPlay");
    expect(block.actions[0]).toMatchObject({
      action: "trashFromField",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "power", comparison: "lte", value: 6000 }],
      },
    });
  });

  test("[On Play] Give -3000 power. Then, trash from hand + draw (multi-segment)", () => {
    const result = buildCardEffects(
      "[On Play] Give up to 2 of your opponent's Characters -3000 power during this turn. Then, trash 1 card from your hand and draw 1 card.",
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.actions).toHaveLength(3);
    expect(block.actions[0]).toMatchObject({ action: "modifyPower", value: -3000 });
    expect(block.actions[1]).toMatchObject({ action: "trashFromHand", amount: 1 });
    expect(block.actions[2]).toMatchObject({ action: "draw", amount: 1 });
  });
});

describe("parseActions — PlayAction", () => {
  describe("basic patterns", () => {
    test("Play this card", () => {
      const result = parseActions("Play this card");
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toEqual({
        action: "play",
        source: { player: "self", zone: "hand" },
        count: { amount: 1 },
      });
      expect(result.unparsed).toBe("");
    });

    test("play this card (lowercase)", () => {
      const result = parseActions("play this card");
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({ action: "play" });
    });

    test("Play up to 1 Character card from your hand", () => {
      const result = parseActions(
        "Play up to 1 Character card with a cost of 3 or less from your hand",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toEqual({
        action: "play",
        source: { player: "self", zone: "hand" },
        count: { amount: 1, upTo: true },
        filters: [
          { filter: "cost", comparison: "lte", value: 3 },
          { filter: "cardCategory", value: "character" },
        ],
      });
      expect(result.unparsed).toBe("");
    });

    test("Play from trash", () => {
      const result = parseActions(
        "Play up to 1 Character card with a cost of 4 or less from your trash",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({
        action: "play",
        source: { player: "self", zone: "trash" },
      });
    });

    test("Play from deck", () => {
      const result = parseActions(
        "Play up to 1 Character card with a cost of 5 or less from your deck",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({
        action: "play",
        source: { player: "self", zone: "deck" },
      });
    });
  });

  describe("play state", () => {
    test("Play rested", () => {
      const result = parseActions(
        "Play up to 1 Character card with a cost of 5 or less from your hand rested",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({
        action: "play",
        playState: "rested",
        source: { player: "self", zone: "hand" },
        count: { amount: 1, upTo: true },
      });
    });
  });

  describe("name filters", () => {
    test("Play specific named card", () => {
      const result = parseActions("Play up to 1 [Gaimon] from your hand");
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toEqual({
        action: "play",
        source: { player: "self", zone: "hand" },
        count: { amount: 1, upTo: true },
        filters: [{ filter: "name", value: "Gaimon" }],
      });
      expect(result.unparsed).toBe("");
    });

    test("Play named card with cost filter", () => {
      const result = parseActions("Play up to 1 [Kin'emon] with a cost of 6 from your hand");
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toEqual({
        action: "play",
        source: { player: "self", zone: "hand" },
        count: { amount: 1, upTo: true },
        filters: [
          { filter: "cost", comparison: "eq", value: 6 },
          { filter: "name", value: "Kin'emon" },
        ],
      });
    });

    test("Play named card with cost or less", () => {
      const result = parseActions("Play up to 1 [Laboon] with a cost of 4 or less from your hand");
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({
        action: "play",
        filters: [
          { filter: "cost", comparison: "lte", value: 4 },
          { filter: "name", value: "Laboon" },
        ],
      });
    });
  });

  describe("trait filters", () => {
    test("Single trait type", () => {
      const result = parseActions(
        "Play up to 1 [Baroque Works] type Character card with a cost of 3 or less from your hand",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({
        action: "play",
        filters: [
          { filter: "cost", comparison: "lte", value: 3 },
          { filter: "trait", value: "Baroque Works" },
          { filter: "cardCategory", value: "character" },
        ],
      });
    });

    test("Multi-trait with 'or'", () => {
      const result = parseActions(
        "Play up to 1 [FILM] or [Straw Hat Crew] type Character card with a cost of 2 or less from your hand",
      );
      expect(result.parsed).toHaveLength(1);
      const play = result.parsed[0]!;
      expect(play).toMatchObject({ action: "play" });
      const filters = (play as { filters: unknown[] }).filters;
      expect(filters).toContainEqual({ filter: "trait", value: "FILM" });
      expect(filters).toContainEqual({ filter: "trait", value: "Straw Hat Crew" });
      expect(filters).toContainEqual({ filter: "cardCategory", value: "character" });
      expect(filters).toContainEqual({ filter: "cost", comparison: "lte", value: 2 });
    });

    test("Curly brace trait syntax", () => {
      const result = parseActions(
        "Play up to 1 {Fish-Man} or {Merfolk} type Character card with a cost of 3 or less from your hand",
      );
      expect(result.parsed).toHaveLength(1);
      const filters = (result.parsed[0] as { filters: unknown[] }).filters;
      expect(filters).toContainEqual({ filter: "trait", value: "Fish-Man" });
      expect(filters).toContainEqual({ filter: "trait", value: "Merfolk" });
    });
  });

  describe("color filters", () => {
    test("Play red Character card", () => {
      const result = parseActions(
        "Play up to 1 red Character card with a cost of 2 or less from your hand",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({
        action: "play",
        filters: [
          { filter: "cost", comparison: "lte", value: 2 },
          { filter: "color", value: "red" },
          { filter: "cardCategory", value: "character" },
        ],
      });
    });

    test("Play green Character card", () => {
      const result = parseActions(
        "Play up to 1 green Character card with a cost of 5 from your hand",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({
        action: "play",
        filters: [
          { filter: "cost", comparison: "eq", value: 5 },
          { filter: "color", value: "green" },
          { filter: "cardCategory", value: "character" },
        ],
      });
    });
  });

  describe("power filters", () => {
    test("Play with power filter", () => {
      const result = parseActions(
        "Play up to 1 red Character card with 3000 power or less from your hand",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({
        action: "play",
        filters: [
          { filter: "power", comparison: "lte", value: 3000 },
          { filter: "color", value: "red" },
          { filter: "cardCategory", value: "character" },
        ],
      });
    });

    test("Play Character with 6000 power or less", () => {
      const result = parseActions(
        "Play up to 1 Character card with 6000 power or less from your hand",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({
        action: "play",
        filters: [
          { filter: "power", comparison: "lte", value: 6000 },
          { filter: "cardCategory", value: "character" },
        ],
      });
    });
  });

  describe("exclude name filter", () => {
    test("Play with 'other than' exclusion", () => {
      const result = parseActions(
        "Play up to 1 [SMILE] type Character card other than [Daifugo] with a cost of 3 or less from your hand",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({
        action: "play",
        filters: [
          { filter: "excludeName", value: "Daifugo" },
          { filter: "cost", comparison: "lte", value: 3 },
          { filter: "trait", value: "SMILE" },
          { filter: "cardCategory", value: "character" },
        ],
      });
    });
  });

  describe("special filters", () => {
    test("Play with 'no base effect'", () => {
      const result = parseActions(
        "play up to 1 Character card with 6000 power or less and no base effect from your hand",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({
        action: "play",
      });
      const filters = (result.parsed[0] as { filters: unknown[] }).filters;
      expect(filters).toContainEqual({ filter: "hasEffectType", value: "onPlay", negate: true });
      expect(filters).toContainEqual({ filter: "power", comparison: "lte", value: 6000 });
      expect(filters).toContainEqual({ filter: "cardCategory", value: "character" });
    });

    test("Play with 'and a [Trigger]'", () => {
      const result = parseActions(
        "Play up to 1 Character card with a cost of 4 or less and a [Trigger] from your hand",
      );
      expect(result.parsed).toHaveLength(1);
      const filters = (result.parsed[0] as { filters: unknown[] }).filters;
      expect(filters).toContainEqual({ filter: "hasTrigger", value: true });
    });
  });

  describe("exact count (no 'up to')", () => {
    test("Play 1 [Name] from your trash", () => {
      const result = parseActions("Play 1 [Ice Oni] from your trash");
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toEqual({
        action: "play",
        source: { player: "self", zone: "trash" },
        count: { amount: 1 },
        filters: [{ filter: "name", value: "Ice Oni" }],
      });
    });
  });

  describe("skips unsupported patterns", () => {
    test("play from your hand or trash (multi-source)", () => {
      const result = parseActions(
        "play up to 1 [Vinsmoke Ichiji] with a cost of 7 from your hand or trash",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({
        action: "play",
        source: { player: "self", zone: ["hand", "trash"] },
      });
    });
  });

  describe("compound actions with play", () => {
    test("draw + play compound", () => {
      const result = parseActions(
        "Draw 1 card and Play up to 1 Character card with a cost of 3 or less from your hand",
      );
      expect(result.parsed).toHaveLength(2);
      expect(result.parsed[0]).toMatchObject({ action: "draw", amount: 1 });
      expect(result.parsed[1]).toMatchObject({ action: "play" });
    });
  });

  describe("real card integration tests", () => {
    test("OP03-040 Biscuit Warrior: play from hand", () => {
      const result = buildCardEffects("[On Play] Play up to 1 [Biscuit Warrior] from your hand.");
      expect(result).toBeDefined();
      const block = result!.effects![0]!;
      expect(block.trigger).toBe("onPlay");
      expect(block.actions[0]).toMatchObject({
        action: "play",
        source: { player: "self", zone: "hand" },
        count: { amount: 1, upTo: true },
        filters: [{ filter: "name", value: "Biscuit Warrior" }],
      });
    });

    test("OP03-077 Donquixote Pirates: play trait from hand", () => {
      const result = buildCardEffects(
        "[On Play] Play up to 1 [Donquixote Pirates] type Character card with a cost of 2 or less from your hand.",
      );
      expect(result).toBeDefined();
      const block = result!.effects![0]!;
      expect(block.actions[0]).toMatchObject({
        action: "play",
        filters: [
          { filter: "cost", comparison: "lte", value: 2 },
          { filter: "trait", value: "Donquixote Pirates" },
          { filter: "cardCategory", value: "character" },
        ],
      });
    });

    test("OP10-011 Scarlet: play rested with other than", () => {
      const result = buildCardEffects(
        "[On Play] Play up to 1 [Dressrosa] type Character card with a cost of 3 or less other than [Scarlet] from your hand rested and give up to 1 of your opponent's Characters -2 cost during this turn.",
      );
      expect(result).toBeDefined();
      const block = result!.effects![0]!;
      // First action is play
      expect(block.actions[0]).toMatchObject({
        action: "play",
        playState: "rested",
        filters: [
          { filter: "excludeName", value: "Scarlet" },
          { filter: "cost", comparison: "lte", value: 3 },
          { filter: "trait", value: "Dressrosa" },
          { filter: "cardCategory", value: "character" },
        ],
      });
    });

    test("OP11-044 Caribou: play named card rested", () => {
      const result = buildCardEffects(
        "[On Play] Play up to 1 [Caribou] with a cost of 4 or less from your hand rested.",
      );
      expect(result).toBeDefined();
      const block = result!.effects![0]!;
      expect(block.actions[0]).toMatchObject({
        action: "play",
        source: { player: "self", zone: "hand" },
        playState: "rested",
        filters: [
          { filter: "cost", comparison: "lte", value: 4 },
          { filter: "name", value: "Caribou" },
        ],
      });
    });
  });
});

describe("parseActions — play from hand or trash", () => {
  test("play up to 1 [Name] with cost from your hand or trash", () => {
    const result = parseActions(
      "play up to 1 [Vinsmoke Ichiji] with a cost of 7 from your hand or trash",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "play",
        source: { player: "self", zone: ["hand", "trash"] },
        count: { amount: 1, upTo: true },
        filters: [
          { filter: "cost", comparison: "eq", value: 7 },
          { filter: "name", value: "Vinsmoke Ichiji" },
        ],
      },
    ]);
  });

  test("play up to 1 Character card from your hand or trash", () => {
    const result = parseActions(
      "play up to 1 Character card with a cost of 5 or less from your hand or trash",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "play",
        source: { player: "self", zone: ["hand", "trash"] },
        count: { amount: 1, upTo: true },
        filters: [
          { filter: "cost", comparison: "lte", value: 5 },
          { filter: "cardCategory", value: "character" },
        ],
      },
    ]);
  });

  test("existing: play from hand still works with single zone", () => {
    const result = parseActions(
      "play up to 1 Character card with a cost of 3 or less from your hand",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "play",
        source: { player: "self", zone: "hand" },
        count: { amount: 1, upTo: true },
        filters: [
          { filter: "cost", comparison: "lte", value: 3 },
          { filter: "cardCategory", value: "character" },
        ],
      },
    ]);
  });
});

describe("trashThisCard action", () => {
  test("trash this Character as standalone action with end of turn timing", () => {
    const result = parseActions("trash this Character at the end of this turn");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({ action: "trashThisCard" });
    expect(result.unparsed).toBe("");
  });

  test("trash this Character without duration", () => {
    const result = parseActions("trash this Character");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({ action: "trashThisCard" });
  });
});
