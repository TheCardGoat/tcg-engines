import { expect, test, describe } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("buildCardEffects — inline conditions", () => {
  test("OP14EB04-088 Miss Merrychristmas: [On K.O.] If leader trait, draw + K.O.", () => {
    const result = buildCardEffects(
      "[On K.O.] If your Leader's type includes \"Baroque Works\", draw 1 card and K.O. up to 1 of your opponent's Stages with a cost of 1.",
    );
    expect(result).toBeDefined();
    expect(result!.effects).toHaveLength(1);
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("onKo");
    expect(block.conditions).toEqual([{ condition: "leaderTrait", trait: "Baroque Works" }]);
    expect(block.actions).toHaveLength(2);
    expect(block.actions[0]).toMatchObject({ action: "draw", amount: 1 });
    expect(block.actions[1]).toMatchObject({
      action: "ko",
      target: {
        player: "opponent",
        zones: ["stage"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "cost", comparison: "eq", value: 1 }],
      },
    });
  });

  test("[When Attacking] If this Character has 5000 power or more, draw + K.O.", () => {
    const result = buildCardEffects(
      "[When Attacking] If this Character has 5000 power or more, draw 1 card and K.O. up to 1 of your opponent's Characters with 3000 base power or less.",
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("whenAttacking");
    expect(block.conditions).toEqual([
      { condition: "cardState", target: "this", property: "power", comparison: "gte", value: 5000 },
    ]);
    expect(block.actions).toHaveLength(2);
    expect(block.actions[0]).toMatchObject({ action: "draw", amount: 1 });
    expect(block.actions[1]).toMatchObject({
      action: "ko",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "basePower", comparison: "lte", value: 3000 }],
      },
    });
  });

  test("[On Play] If you have 2 or less Life cards, draw 2 cards", () => {
    const result = buildCardEffects("[On Play] If you have 2 or less Life cards, draw 2 cards.");
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("onPlay");
    expect(block.conditions).toEqual([
      { condition: "lifeCount", player: "self", comparison: "lte", value: 2 },
    ]);
    expect(block.actions).toEqual([{ action: "draw", player: "self", amount: 2 }]);
  });

  test("inline condition merges with bracket conditions", () => {
    const result = buildCardEffects(
      '[DON!! x2] [When Attacking] If your Leader has the "Navy" type, draw 1 card.',
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("whenAttacking");
    expect(block.conditions).toEqual([
      { condition: "donAttached", amount: 2 },
      { condition: "leaderTrait", trait: "Navy" },
    ]);
    expect(block.actions).toEqual([{ action: "draw", player: "self", amount: 1 }]);
  });

  test("OP12-089 Hack: [On K.O.] If leader trait, K.O. with base cost", () => {
    const result = buildCardEffects(
      'If your Leader has the "Revolutionary Army" type, this Character gains [Blocker] and +4 cost.\n[On K.O.] If your Leader has the "Revolutionary Army" type, K.O. up to 1 of your opponent\'s Characters with a base cost of 4 or less.',
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("onKo");
    expect(block.conditions).toEqual([{ condition: "leaderTrait", trait: "Revolutionary Army" }]);
    expect(block.actions[0]).toMatchObject({
      action: "ko",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "baseCost", comparison: "lte", value: 4 }],
      },
    });
  });

  test("[When Attacking] If you have 7 or more cards in your trash, draw 1 card", () => {
    const result = buildCardEffects(
      "[When Attacking] If you have 7 or more cards in your trash, draw 1 card.",
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.conditions).toEqual([
      { condition: "zoneCount", player: "self", zone: "trash", comparison: "gte", value: 7 },
    ]);
  });

  test("no condition when If is absent", () => {
    const result = buildCardEffects("[On Play] Draw 2 cards.");
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.conditions).toBeUndefined();
  });
});

// ── parseActions — ModifyPowerAction ──

describe("buildCardEffects — Choose one", () => {
  test("choose one with two parseable options", () => {
    const effects = buildCardEffects(
      "[On Play] Choose one:\n• Trash up to 1 of your opponent's Characters with a cost of 3 or less.\n• Draw 2 cards.",
    );
    expect(effects).toBeDefined();
    expect(effects!.effects).toHaveLength(1);
    const block = effects!.effects![0]!;
    expect(block.actions).toHaveLength(1);
    expect(block.actions[0]).toMatchObject({
      action: "choice",
      options: [[{ action: "trashFromField" }], [{ action: "draw", amount: 2 }]],
    });
  });

  test("choose one with K.O. and draw options", () => {
    const effects = buildCardEffects(
      "[On Play] Choose one:\n• K.O. up to 1 of your opponent's Characters with a cost of 5 or less.\n• Draw 1 card.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    const choice = block.actions[0]!;
    expect(choice).toMatchObject({ action: "choice" });
    if (choice.action === "choice") {
      expect(choice.options).toHaveLength(2);
      expect(choice.options[0]![0]).toMatchObject({ action: "ko" });
      expect(choice.options[1]![0]).toMatchObject({ action: "draw" });
    }
  });

  test("choose one with DON!! cost prefix", () => {
    const effects = buildCardEffects(
      "[On Play] DON!! -3: Choose one:\n• K.O. up to 1 of your opponent's Characters with a cost of 7 or less.\n• Rest up to 2 of your opponent's Characters.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.costs).toBeDefined();
    expect(block.actions).toHaveLength(1);
    expect(block.actions[0]).toMatchObject({ action: "choice" });
  });
});

// ── Real card integration tests ──

describe("buildCardEffects — Jinbe EB04-015 integration", () => {
  test("[On K.O.] rest cost + multi-trait leader condition + play action", () => {
    const result = buildCardEffects(
      "[Blocker]\n[On K.O.] You may rest 1 of your cards: If your Leader has the {Fish-Man} or {Merfolk} type, play up to 1 green Character card with a cost of 6 or less from your hand.",
    );
    expect(result).toBeDefined();
    expect(result!.keywords).toContain("blocker");
    expect(result!.effects).toHaveLength(1);

    const block = result!.effects![0]!;
    expect(block.trigger).toBe("onKo");
    expect(block.optional).toBe(true);

    // Cost: rest 1 of your cards
    expect(block.costs).toEqual([{ cost: "restCards", amount: 1 }]);

    // Condition: leader has Fish-Man or Merfolk type
    expect(block.conditions).toEqual([
      {
        condition: "compound",
        operator: "or",
        conditions: [
          { condition: "leaderTrait", trait: "Fish-Man" },
          { condition: "leaderTrait", trait: "Merfolk" },
        ],
      },
    ]);

    // Action: play up to 1 green Character card with cost 6 or less from hand
    expect(block.actions).toHaveLength(1);
    expect(block.actions[0]).toMatchObject({
      action: "play",
      source: { player: "self", zone: "hand" },
      count: { amount: 1, upTo: true },
      filters: expect.arrayContaining([
        { filter: "color", value: "green" },
        { filter: "cardCategory", value: "character" },
        { filter: "cost", comparison: "lte", value: 6 },
      ]),
    });
  });
});
