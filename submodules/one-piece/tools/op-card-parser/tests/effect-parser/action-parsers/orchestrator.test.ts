import { expect, test, describe } from "vite-plus/test";
import { parseActions, parseEffectText } from "../../../src/effect-parser/index.ts";

describe("parseActions", () => {
  test("schedules the Character played by the preceding action to return to its owner's deck", () => {
    const result = parseActions(
      'Draw 1 card and play up to 1 "SWORD" type Character card with a cost of 8 or less other than [Helmeppo] from your trash. Then, place the 1 Character played by this effect at the bottom of the owner\'s deck at the end of this turn.',
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      { action: "draw", player: "self", amount: 1 },
      expect.objectContaining({
        action: "play",
        source: { player: "self", zone: "trash" },
        filters: expect.arrayContaining([
          { filter: "trait", value: "SWORD", match: "includes" },
          { filter: "cost", comparison: "lte", value: 8 },
          { filter: "excludeName", value: "Helmeppo" },
        ]),
      }),
      {
        action: "delayed",
        timing: "endOfThisTurn",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
            },
            position: "bottom",
            previousActionTargets: true,
          },
        ],
      },
    ]);
  });

  test("preserves cost guessing as the gate for every matching action", () => {
    const result = parseActions(
      "Choose a cost and reveal 1 card from the top of your opponent's deck. If the revealed card has the chosen cost, K.O. up to 1 of your opponent's Characters with a base cost of 3 or less. Then, add up to 1 DON!! card from your DON!! deck and rest it.",
    );

    expect(result).toEqual({
      parsed: [
        {
          action: "guessTopDeckCost",
          player: "opponent",
          onMatch: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "baseCost", comparison: "lte", value: 3 }],
              },
            },
            {
              action: "addDon",
              count: { amount: 1, upTo: true },
              state: "rested",
            },
          ],
        },
      ],
      unparsed: "",
    });
  });

  test("trashes the top Life card of both players", () => {
    const result = parseActions(
      "Trash 1 card from the top of each of your and your opponent's Life cards.",
    );

    expect(result).toEqual({
      parsed: [
        {
          action: "sequence",
          actions: [
            {
              action: "removeFromLife",
              player: "self",
              count: { amount: 1 },
              destination: "trash",
              position: "top",
            },
            {
              action: "removeFromLife",
              player: "opponent",
              count: { amount: 1 },
              destination: "trash",
              position: "top",
            },
          ],
        },
      ],
      unparsed: "",
    });
  });

  test("moves the replaced Character to face-down Life", () => {
    const result = parseActions("You may add it to the top of your Life cards face-down instead.");

    expect(result).toEqual({
      parsed: [
        {
          action: "addToLife",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: 1 },
          },
          position: "top",
          previousActionTargets: true,
        },
      ],
      unparsed: "",
    });
  });

  test("looks privately at the opponent's top deck card", () => {
    expect(parseActions("Look at 1 card from the top of your opponent's deck.")).toEqual({
      parsed: [{ action: "lookAtTopDeckCard", player: "opponent" }],
      unparsed: "",
    });
  });

  test("preserves a leading power action before a complete search continuation", () => {
    const result = parseActions(
      "Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, look at 3 cards from the top of your deck; reveal up to 1 [Donquixote Pirates] type Character card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed).toMatchObject([
      { action: "modifyPower", value: 4000, duration: "thisBattle" },
      {
        action: "search",
        lookCount: 3,
        revealFilters: [
          { filter: "trait", value: "Donquixote Pirates", match: "includes" },
          { filter: "cardCategory", value: "character" },
        ],
        remainderPosition: "bottom",
      },
    ]);
  });

  test("preserves a cost-gated top-deck reveal, conditional action, and final position", () => {
    const result = parseActions(
      "Reveal 1 card from the top of your deck. If the revealed card has a cost of 4 or more, return up to 1 of your Characters to the owner's hand. Then, place the revealed card at the bottom of your deck.",
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "revealTopDeckCard",
        player: "self",
        conditional: {
          filters: [{ filter: "cost", comparison: "gte", value: 4 }],
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
            },
          ],
        },
        finalPosition: "bottom",
      },
    ]);
  });

  test("splits self power and all-trait cost modifiers joined by comma-and", () => {
    expect(
      parseActions(
        'this Character gains +1000 power, and all of your Characters with a type including "Baroque Works" gain +2 cost',
      ).parsed,
    ).toEqual([
      {
        action: "modifyPower",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          self: true,
        },
        value: 1000,
        duration: "permanent",
      },
      {
        action: "modifyCost",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: "all" },
          filters: [{ filter: "trait", value: "Baroque Works", match: "includes" }],
        },
        value: 2,
        duration: undefined,
      },
    ]);
  });

  describe("non-draw/rest/ko actions stay unparsed", () => {
    test("returns full text as unparsed for unknown actions", () => {
      const result = parseActions("Look at the top 5 cards of your deck");
      expect(result.parsed).toEqual([]);
      expect(result.unparsed).toBe("Look at the top 5 cards of your deck");
    });

    test("returns empty for empty input", () => {
      const result = parseActions("");
      expect(result.parsed).toEqual([]);
      expect(result.unparsed).toBe("");
    });
  });

  describe("real card integration", () => {
    test("OP02-064 Mr.2: schedules the dependent self-return at the end of the battle", () => {
      const actions = parseActions(
        "Place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck. Then, at the end of this battle, place this Character at the bottom of the owner's deck.",
      );

      expect(actions).toEqual({
        parsed: [
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
          {
            action: "delayed",
            timing: "endOfThisBattle",
            actions: [
              {
                action: "returnToDeck",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: { amount: 1 },
                  self: true,
                },
                position: "bottom",
              },
            ],
          },
        ],
        unparsed: "",
      });
    });

    test("EB01-023 Edward Weevil: '[On Play] Draw 1 card.'", () => {
      const effectText = "[On Play] Draw 1 card.";
      const parsed = parseEffectText(effectText);
      expect(parsed.segments).toHaveLength(1);
      const seg = parsed.segments[0]!;
      const actions = parseActions(seg.rawActionText);
      expect(actions.parsed).toEqual([{ action: "draw", player: "self", amount: 1 }]);
      expect(actions.unparsed).toBe("");
    });

    test("OP13-041 Izo: '[On Play] Draw 2 cards.'", () => {
      const parsed = parseEffectText("[On Play] Draw 2 cards.");
      const actions = parseActions(parsed.segments[0]!.rawActionText);
      expect(actions.parsed).toEqual([{ action: "draw", player: "self", amount: 2 }]);
      expect(actions.unparsed).toBe("");
    });

    test("OP13-093 Morgans: compound draw + trash", () => {
      const effectText =
        "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Draw 2 cards and trash 2 cards from your hand.";
      const parsed = parseEffectText(effectText);
      // Blocker is skipped as keyword-only, [On Play] is the segment
      expect(parsed.segments).toHaveLength(1);
      const actions = parseActions(parsed.segments[0]!.rawActionText);
      expect(actions.parsed).toHaveLength(2);
      expect(actions.parsed[0]).toEqual({ action: "draw", player: "self", amount: 2 });
      expect(actions.parsed[1]).toEqual({ action: "trashFromHand", player: "self", amount: 2 });
      expect(actions.unparsed).toBe("");
    });

    test("EB04-011 Scaled Neptunian: derives draw and trash amounts from matching Characters", () => {
      const actions = parseActions(
        "Draw a card for each of your {Neptunian} type Characters. Then, trash the same number of cards from your hand.",
      );
      const amountFromTarget = {
        player: "self",
        zones: ["character"],
        count: { amount: "all" },
        filters: [{ filter: "trait", value: "Neptunian", match: "includes" }],
      };
      expect(actions.parsed).toEqual([
        { action: "draw", player: "self", amount: 0, amountFromTarget },
        {
          action: "trashFromHand",
          player: "self",
          amount: 0,
          amountFromPreviousActionTargets: true,
        },
      ]);
      expect(actions.unparsed).toBe("");
    });

    test("EB04-013 Carrot: keeps two Minks Characters and the Leader as separate targets", () => {
      const parsed = parseEffectText(
        "[On Play] If your Leader has the {Minks} type, set up to 2 of your {Minks} type Characters and your Leader as active.",
      );
      const actions = parseActions(parsed.segments[0]!.rawActionText);

      expect(actions.parsed).toEqual([
        {
          action: "setActive",
          condition: { condition: "leaderTrait", trait: "Minks", match: "includes" },
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: 2, upTo: true },
            filters: [{ filter: "trait", value: "Minks", match: "includes" }],
          },
        },
        {
          action: "setActive",
          condition: { condition: "leaderTrait", trait: "Minks", match: "includes" },
          target: {
            player: "self",
            zones: ["leader"],
            count: { amount: 1 },
          },
        },
      ]);
      expect(actions.unparsed).toBe("");
    });

    test("OP14EB04-051 Hatchan: '[DON!! x2] [On K.O.] Draw 1 card.'", () => {
      const parsed = parseEffectText("[DON!! x2] [On K.O.] Draw 1 card.");
      expect(parsed.segments).toHaveLength(1);
      const seg = parsed.segments[0]!;
      expect(seg.triggers).toEqual(["onKo"]);
      expect(seg.conditions).toEqual([{ condition: "donAttached", amount: 2 }]);
      const actions = parseActions(seg.rawActionText);
      expect(actions.parsed).toEqual([{ action: "draw", player: "self", amount: 1 }]);
      expect(actions.unparsed).toBe("");
    });

    test("OP13-054 Yamato: draw with preceding condition", () => {
      const parsed = parseEffectText(
        "[On Play] If you have 3 or less Life cards, draw 2 cards. Then, give up to 1 rested DON!! card to your Leader.",
      );
      expect(parsed.segments).toHaveLength(1);
      const segment = parsed.segments[0]!;
      const actions = parseActions(segment.rawActionText);
      expect(actions.parsed).toHaveLength(2);
      expect(actions.parsed[0]).toEqual({
        action: "draw",
        player: "self",
        amount: 2,
        condition: {
          condition: "lifeCount",
          player: "self",
          comparison: "lte",
          value: 3,
        },
      });
      expect(actions.parsed[1]).toMatchObject({ action: "giveDon" });
      expect(actions.unparsed).toBe("");
    });
  });

  describe("clause splitting", () => {
    test("does not split 'and' inside non-action context", () => {
      const result = parseActions("your Leader and 1 Character gain +1000 power");
      expect(result.parsed).toEqual([]);
      // Should NOT split at "and" since "1 Character" isn't a known action verb
      expect(result.unparsed).toBe("your Leader and 1 Character gain +1000 power");
    });

    test("splits 'and draw' correctly", () => {
      const result = parseActions("rest up to 1 of your opponent's Characters and draw 1 card");
      expect(result.parsed).toHaveLength(2);
      expect(result.parsed[0]).toMatchObject({ action: "rest" });
      expect(result.parsed[1]).toEqual({ action: "draw", player: "self", amount: 1 });
      expect(result.unparsed).toBe("");
    });
  });
});

describe("splitActionClauses — up to fix", () => {
  test("splits 'draw and up to' compound", () => {
    const result = parseActions(
      "Draw 2 cards and up to 1 of your Leader or Character cards gains +4000 power during this battle",
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({ action: "draw", amount: 2 });
    expect(result.parsed[1]).toMatchObject({ action: "modifyPower", value: 4000 });
  });

  test("splits 'ko and up to' compound", () => {
    const result = parseActions(
      "K.O. up to 1 of your opponent's Characters with a cost of 3 or less and up to 1 of your Characters gains +2000 power during this turn",
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({ action: "ko" });
    expect(result.parsed[1]).toMatchObject({ action: "modifyPower", value: 2000 });
  });

  test("does not split 'and rest it' (AddDon pattern)", () => {
    const result = parseActions("Add up to 1 DON!! card from your DON!! deck and rest it");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({ action: "addDon" });
  });

  test("does not split 'and set it as active' (AddDon pattern)", () => {
    const result = parseActions("Add up to 1 DON!! card from your DON!! deck and set it as active");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({ action: "addDon" });
  });
});

describe("parseActions — mixed DON!! and Character rest", () => {
  test("emits one mixed-zone choice with Character-only cost filtering", () => {
    const result = parseActions(
      "rest up to 1 of your opponent's DON!! cards or Characters with a cost of 6 or less",
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "rest",
        target: {
          player: "opponent",
          zones: ["costArea", "character"],
          count: { amount: 1, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 6 }],
        },
      },
    ]);
  });
});

describe("parseActions — [Trigger] suffix stripping", () => {
  test("strips '. [Trigger]' suffix from action text", () => {
    const result = parseActions(
      "Give up to 1 of your opponent's Leader or Character cards -2000 power during this turn. [Trigger] Activate this card's [Counter] effect",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "modifyPower",
      value: -2000,
      duration: "thisTurn",
    });
  });

  test("strips '. [Trigger]' after addDon", () => {
    const result = parseActions(
      "Add up to 1 DON!! card from your DON!! deck and rest it. [Trigger] Play this card",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({ action: "addDon", state: "rested" });
  });

  test("does not strip [Trigger] mid-sentence (filter context)", () => {
    const result = parseActions(
      "Play up to 1 Character card with a cost of 4 or less and a [Trigger] from your hand",
    );
    expect(result.parsed).toHaveLength(1);
    const filters = (result.parsed[0] as { filters: unknown[] }).filters;
    expect(filters).toContainEqual({ filter: "hasTrigger", value: true });
  });
});

describe("parseActions — sentence splitting", () => {
  test("keeps an all-deck named reveal before its explicit shuffle", () => {
    const result = parseActions(
      "Reveal up to 1 [Kurozumi Higurashi] from your deck and add it to your hand. Then, shuffle your deck.",
    );

    expect(result).toEqual({
      parsed: [
        {
          action: "search",
          lookCount: 0,
          source: { player: "self", zone: "deck" },
          revealCount: { amount: 1, upTo: true },
          revealFilters: [{ filter: "name", value: "Kurozumi Higurashi" }],
          revealDestination: "hand",
          remainderPosition: "bottom",
        },
        { action: "shuffleDeck", player: "self" },
      ],
      unparsed: "",
    });
  });

  test("K.O. then This Character gains keyword", () => {
    const result = parseActions(
      "K.O. up to 1 of your opponent's Characters with a cost of 6 or less. This Character gains [Rush] during this turn.",
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({ action: "ko" });
    expect(result.parsed[1]).toMatchObject({
      action: "grantKeyword",
      keyword: "rush",
      duration: "thisTurn",
    });
  });
});

describe("parseActions — Trigger source movement", () => {
  test("keeps an explicit add-this-card-to-hand instruction", () => {
    const result = parseActions(
      "K.O. up to 1 of your opponent's Characters with a cost of 1 or less and add this card to your hand.",
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "ko",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 1 }],
        },
      },
      { action: "addThisCardToHand" },
    ]);
  });
});
