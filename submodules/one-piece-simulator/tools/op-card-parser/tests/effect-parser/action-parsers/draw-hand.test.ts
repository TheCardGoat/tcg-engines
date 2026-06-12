import { expect, test, describe } from "vite-plus/test";
import { buildCardEffects, parseActions } from "../../../src/effect-parser/index.ts";

describe("DrawAction", () => {
  test("parses 'Draw 1 card'", () => {
    const result = parseActions("Draw 1 card.");
    expect(result.parsed).toEqual([{ action: "draw", player: "self", amount: 1 }]);
    expect(result.unparsed).toBe("");
  });

  test("parses 'Draw 2 cards'", () => {
    const result = parseActions("Draw 2 cards.");
    expect(result.parsed).toEqual([{ action: "draw", player: "self", amount: 2 }]);
    expect(result.unparsed).toBe("");
  });

  test("parses without trailing period", () => {
    const result = parseActions("Draw 3 cards");
    expect(result.parsed).toEqual([{ action: "draw", player: "self", amount: 3 }]);
    expect(result.unparsed).toBe("");
  });

  test("is case-insensitive", () => {
    const result = parseActions("draw 1 card");
    expect(result.parsed).toEqual([{ action: "draw", player: "self", amount: 1 }]);
  });
});

describe("compound actions with draw", () => {
  test("extracts draw + trash from 'Draw 2 cards and trash 1 card from your hand'", () => {
    const result = parseActions("Draw 2 cards and trash 1 card from your hand");
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toEqual({ action: "draw", player: "self", amount: 2 });
    expect(result.parsed[1]).toEqual({ action: "trashFromHand", player: "self", amount: 1 });
    expect(result.unparsed).toBe("");
  });

  test("extracts draw + trash from 'Draw 3 cards and trash 2 cards from your hand'", () => {
    const result = parseActions("Draw 3 cards and trash 2 cards from your hand");
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toEqual({ action: "draw", player: "self", amount: 3 });
    expect(result.parsed[1]).toEqual({ action: "trashFromHand", player: "self", amount: 2 });
    expect(result.unparsed).toBe("");
  });

  test("handles '. Then, ' separator", () => {
    const result = parseActions(
      "Draw 2 cards. Then, give your Leader and 1 Character up to 2 rested DON!! cards each.",
    );
    expect(result.parsed).toEqual([
      { action: "draw", player: "self", amount: 2 },
      {
        action: "giveDon",
        target: {
          player: "self",
          zones: ["leader", "character"],
          count: { amount: 1 },
        },
        count: { amount: 2, upTo: true },
        donState: "rested",
      },
    ]);
    expect(result.unparsed).toBe("");
  });

  test("handles draw + then + draw", () => {
    const result = parseActions("Draw 1 card. Then, draw 1 card.");
    expect(result.parsed).toEqual([
      { action: "draw", player: "self", amount: 1 },
      { action: "draw", player: "self", amount: 1 },
    ]);
    expect(result.unparsed).toBe("");
  });
});

describe("parseActions — TrashActions", () => {
  describe("TrashFromHand", () => {
    test("trash 1 card from your hand", () => {
      const result = parseActions("trash 1 card from your hand");
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toEqual({
        action: "trashFromHand",
        player: "self",
        amount: 1,
      });
      expect(result.unparsed).toBe("");
    });

    test("trash 2 cards from your hand", () => {
      const result = parseActions("trash 2 cards from your hand");
      expect(result.parsed[0]).toEqual({
        action: "trashFromHand",
        player: "self",
        amount: 2,
      });
    });

    test("Trash 1 card from your opponent's hand", () => {
      const result = parseActions("Trash 1 card from your opponent's hand");
      expect(result.parsed[0]).toEqual({
        action: "trashFromHand",
        player: "opponent",
        amount: 1,
      });
    });
  });
});

describe("parseActions — opponent trashFromHand", () => {
  test("your opponent trashes 1 card from their hand", () => {
    const result = parseActions("your opponent trashes 1 card from their hand");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([{ action: "trashFromHand", player: "opponent", amount: 1 }]);
  });

  test("your opponent trashes 2 cards from their hand", () => {
    const result = parseActions("your opponent trashes 2 cards from their hand");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([{ action: "trashFromHand", player: "opponent", amount: 2 }]);
  });

  test("existing: trash 1 card from your hand still works", () => {
    const result = parseActions("trash 1 card from your hand");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([{ action: "trashFromHand", player: "self", amount: 1 }]);
  });
});

describe("parseActions — draw with trailing condition", () => {
  test("Draw 1 card if you have 5 or less cards in your hand", () => {
    const result = parseActions("Draw 1 card if you have 5 or less cards in your hand");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "draw",
        player: "self",
        amount: 1,
        condition: {
          condition: "handCount",
          player: "self",
          comparison: "lte",
          value: 5,
        },
      },
    ]);
  });

  test("Draw 1 card if you have 3 or less cards in your hand", () => {
    const result = parseActions("Draw 1 card if you have 3 or less cards in your hand");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "draw",
        player: "self",
        amount: 1,
        condition: {
          condition: "handCount",
          player: "self",
          comparison: "lte",
          value: 3,
        },
      },
    ]);
  });

  test("existing: simple Draw 2 cards still works", () => {
    const result = parseActions("Draw 2 cards");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([{ action: "draw", player: "self", amount: 2 }]);
  });

  // ── cannotBeKod action ──

  test("cannotBeKod: This Character cannot be K.O.'d in battle", () => {
    const result = parseActions("This Character cannot be K.O.'d in battle");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotBeKod",
        target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
        duration: "permanent",
        restriction: "inBattle",
      },
    ]);
  });

  test("cannotBeKod: This Character cannot be K.O.'d by effects", () => {
    const result = parseActions("This Character cannot be K.O.'d by effects");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotBeKod",
        target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
        duration: "permanent",
        restriction: "byEffect",
      },
    ]);
  });

  test('cannotBeKod: with attribute filter — by "Slash" attribute cards', () => {
    const result = parseActions(
      'This Character cannot be K.O.\'d in battle by "Slash" attribute cards',
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotBeKod",
        target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
        duration: "permanent",
        restriction: "inBattle",
        byFilter: [{ filter: "attribute", value: "slash" }],
      },
    ]);
  });

  test("cannotBeKod: split from compound — gains power and cannot be K.O.'d", () => {
    const result = parseActions("This Character gains +1000 power and cannot be K.O.'d by effects");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toEqual({
      action: "modifyPower",
      target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
      value: 1000,
      duration: "permanent",
    });
    expect(result.parsed[1]).toEqual({
      action: "cannotBeKod",
      target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
      duration: "permanent",
      restriction: "byEffect",
    });
  });

  // ── freeze action ──

  test("freeze: Up to N of opponent's rested Characters", () => {
    const result = parseActions(
      "Up to 1 of your opponent's rested Characters will not become active in your opponent's next Refresh Phase",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "freeze",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
          filters: [{ filter: "state", value: "rested" }],
        },
      },
    ]);
  });

  test("freeze: with cost filter", () => {
    const result = parseActions(
      "Up to 2 of your opponent's rested Characters with a cost of 5 or less will not become active in your opponent's next Refresh Phase",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "freeze",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 2, upTo: true },
          filters: [
            { filter: "state", value: "rested" },
            { filter: "cost", comparison: "lte", value: 5 },
          ],
        },
      },
    ]);
  });

  test("freeze: Leader and Character cards (total of)", () => {
    const result = parseActions(
      "Up to a total of 3 of your opponent's rested Leader and Character cards will not become active in your opponent's next Refresh Phase",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "freeze",
        target: {
          player: "opponent",
          zones: ["leader", "character"],
          count: { amount: 3, upTo: true },
          filters: [{ filter: "state", value: "rested" }],
        },
      },
    ]);
  });

  test("freeze: self — this Character will not become active", () => {
    const result = parseActions("this Character will not become active in your next Refresh Phase");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "freeze",
        target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
      },
    ]);
  });

  // ── playRestriction action ──

  test("playRestriction: cannot play Character cards with a base cost", () => {
    const result = parseActions(
      "you cannot play Character cards with a base cost of 5 or more during this turn",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "playRestriction",
        restriction: "cannotPlay",
        filters: [
          { filter: "cardCategory", value: "character" },
          { filter: "baseCost", comparison: "gte", value: 5 },
        ],
        duration: "thisTurn",
      },
    ]);
  });

  test("playRestriction: cannot play Character cards (no base cost filter)", () => {
    const result = parseActions("you cannot play Character cards during this turn");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "playRestriction",
        restriction: "cannotPlay",
        filters: [{ filter: "cardCategory", value: "character" }],
        duration: "thisTurn",
      },
    ]);
  });

  test("playRestriction: cannot play cards from your hand", () => {
    const result = parseActions("you cannot play cards from your hand during this turn");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "playRestriction",
        restriction: "cannotPlay",
        filters: [],
        duration: "thisTurn",
      },
    ]);
  });

  test("playRestriction: any Character cards on your field", () => {
    const result = parseActions(
      "you cannot play any Character cards on your field during this turn",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "playRestriction",
        restriction: "cannotPlay",
        filters: [{ filter: "cardCategory", value: "character" }],
        duration: "thisTurn",
      },
    ]);
  });

  // ── opponentReturnDon action ──

  test("opponentReturnDon: 1 DON!! card", () => {
    const result = parseActions(
      "Your opponent returns 1 DON!! card from their field to their DON!! deck",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([{ action: "opponentReturnDon", amount: 1 }]);
  });

  test("opponentReturnDon: 2 DON!! cards", () => {
    const result = parseActions(
      "Your opponent returns 2 DON!! cards from their field to their DON!! deck",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([{ action: "opponentReturnDon", amount: 2 }]);
  });

  // ── Multi-target modifyPower ──

  test("modifyPower: Your Leader and all of your Characters gain +1000", () => {
    const result = parseActions(
      "Your Leader and all of your Characters gain +1000 power during this turn",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "modifyPower",
        target: { player: "self", zones: ["leader", "character"], count: { amount: "all" } },
        value: 1000,
        duration: "thisTurn",
      },
    ]);
  });

  test("modifyPower: all of your Characters gain +1000 until start of next turn", () => {
    const result = parseActions(
      "Your Leader and all of your Characters gain +1000 power until the start of your next turn",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "modifyPower",
        target: { player: "self", zones: ["leader", "character"], count: { amount: "all" } },
        value: 1000,
        duration: "untilStartOfNextTurn",
      },
    ]);
  });

  test("modifyPower: give all opponent Characters -2000 until end of opponent's next End Phase", () => {
    const result = parseActions(
      "give all of your opponent's Characters -2000 power until the end of your opponent's next End Phase",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "modifyPower",
        target: { player: "opponent", zones: ["character"], count: { amount: "all" } },
        value: -2000,
        duration: "untilEndOfOpponentNextEndPhase",
      },
    ]);
  });

  // ── grantKeyword with extended duration ──

  test("grantKeyword: gains [Rush] until the start of your next turn", () => {
    const result = parseActions("this card gains [Rush] until the start of your next turn");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "grantKeyword",
        target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
        keyword: "rush",
        duration: "untilStartOfNextTurn",
      },
    ]);
  });

  test("grantKeyword: gains [Double Attack] until the end of your opponent's next turn", () => {
    const result = parseActions(
      "this card gains [Double Attack] until the end of your opponent's next turn",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "grantKeyword",
        target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
        keyword: "doubleAttack",
        duration: "untilEndOfOpponentNextTurn",
      },
    ]);
  });

  // ── addToLife from hand ──

  test("addToLife: from hand — simple", () => {
    const result = parseActions("Add up to 1 card from your hand to the top of your Life cards");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "addToLife",
        target: {
          player: "self",
          zones: ["hand"],
          count: { amount: 1, upTo: true },
        },
        position: "top",
      },
    ]);
  });

  test("addToLife: from hand with trait filter and face-up", () => {
    const result = parseActions(
      'Add up to 1 "Revolutionary Army" type Character card from your hand to the top of your Life cards face-up',
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed[0]).toMatchObject({
      action: "addToLife",
      position: "top",
      faceUp: true,
    });
    expect(result.parsed[0]).toHaveProperty("target.zones", ["hand"]);
    expect(result.parsed[0]).toHaveProperty("target.count.upTo", true);
  });

  // ── Real card integration: compound parsing ──

  test("real card: OP02-114 Borsalino — gains power and cannotBeKod compound", () => {
    const effects = buildCardEffects(
      "[Opponent's Turn] This Character gains +1000 power and cannot be K.O.'d by effects. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
    );
    expect(effects).toBeDefined();
    expect(effects!.keywords).toContain("blocker");
    expect(effects!.permanentEffects).toHaveLength(1);
    const perm = effects!.permanentEffects![0]!;
    expect(perm.actions).toHaveLength(2);
    expect(perm.actions[0]).toMatchObject({ action: "modifyPower", value: 1000 });
    expect(perm.actions[1]).toMatchObject({ action: "cannotBeKod", restriction: "byEffect" });
  });

  test("real card: OP08-022 Inuarashi — freeze with trait condition and cost filter", () => {
    const effects = buildCardEffects(
      "[On Play] If your Leader has the {Minks} type, up to 2 of your opponent's rested Characters with a cost of 5 or less will not become active in your opponent's next Refresh Phase.",
    );
    expect(effects).toBeDefined();
    expect(effects!.effects).toHaveLength(1);
    const block = effects!.effects![0]!;
    expect(block.trigger).toBe("onPlay");
    expect(block.conditions).toEqual([{ condition: "leaderTrait", trait: "Minks" }]);
    expect(block.actions).toEqual([
      {
        action: "freeze",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 2, upTo: true },
          filters: [
            { filter: "state", value: "rested" },
            { filter: "cost", comparison: "lte", value: 5 },
          ],
        },
      },
    ]);
  });

  test("real card: OP13-023 Uta — setActive then playRestriction", () => {
    const effects = buildCardEffects(
      "[On Play] Set up to 2 of your DON!! cards as active. Then, you cannot play Character cards with a base cost of 5 or more during this turn.\n[On K.O.] Play up to 1 Character card with a cost of 5 or less from your hand rested.",
    );
    expect(effects).toBeDefined();
    expect(effects!.effects).toHaveLength(2);
    const onPlay = effects!.effects![0]!;
    expect(onPlay.trigger).toBe("onPlay");
    expect(onPlay.actions).toHaveLength(2);
    expect(onPlay.actions[0]).toMatchObject({ action: "setActive" });
    expect(onPlay.actions[1]).toMatchObject({
      action: "playRestriction",
      restriction: "cannotPlay",
      duration: "thisTurn",
    });
  });

  test("real card: OP02-085 Magellan — opponentReturnDon", () => {
    const effects = buildCardEffects(
      "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Your opponent returns 1 DON!! card from their field to their DON!! deck.",
    );
    expect(effects).toBeDefined();
    expect(effects!.effects).toHaveLength(1);
    const block = effects!.effects![0]!;
    expect(block.trigger).toBe("onPlay");
    expect(block.costs).toEqual([{ cost: "returnDon", amount: 1 }]);
    expect(block.actions).toEqual([{ action: "opponentReturnDon", amount: 1 }]);
  });

  test("real card: OP02/OP05 Uta — Leader + all Characters gain power with duration", () => {
    const effects = buildCardEffects(
      "[On Play] DON!! -2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Your Leader and all of your Characters gain +1000 power until the start of your next turn.",
    );
    expect(effects).toBeDefined();
    expect(effects!.effects).toHaveLength(1);
    const block = effects!.effects![0]!;
    expect(block.trigger).toBe("onPlay");
    expect(block.costs).toEqual([{ cost: "returnDon", amount: 2 }]);
    expect(block.actions).toEqual([
      {
        action: "modifyPower",
        target: { player: "self", zones: ["leader", "character"], count: { amount: "all" } },
        value: 1000,
        duration: "untilStartOfNextTurn",
      },
    ]);
  });

  // ── setActive DON!! variants ──

  test("setActive: set up to N of your DON!! cards as active", () => {
    const result = parseActions("set up to 2 of your DON!! cards as active");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "setActive",
        target: { player: "self", zones: ["costArea"], count: { amount: 2, upTo: true } },
      },
    ]);
  });

  test("setActive: at the end of this turn — timing stripped", () => {
    const result = parseActions(
      "set up to 1 of your DON!! cards as active at the end of this turn",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed[0]).toMatchObject({ action: "setActive" });
  });

  test("setActive: Set all of your DON!! cards as active", () => {
    const result = parseActions("Set all of your DON!! cards as active");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "setActive",
        target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
      },
    ]);
  });

  // ── addDon variants ──

  test("addDon: without 'up to'", () => {
    const result = parseActions("Add 1 DON!! card from your DON!! deck and rest it");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([{ action: "addDon", count: { amount: 1 }, state: "rested" }]);
  });

  test("addDon: trailing comma stripped", () => {
    const result = parseActions("Add up to 1 DON!! card from your DON!! deck and rest it,");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      { action: "addDon", count: { amount: 1, upTo: true }, state: "rested" },
    ]);
  });

  // ── giveDon reversed order ──

  test("giveDon: reversed — give this Character up to 2 rested DON!!", () => {
    const result = parseActions("give this Character up to 2 rested DON!! cards");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "giveDon",
        target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
        count: { amount: 2, upTo: true },
        donState: "rested",
      },
    ]);
  });

  test("giveDon: give rested DON to [Name] Leader", () => {
    const result = parseActions("give up to 3 rested DON!! cards to your [Roronoa Zoro] Leader");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "giveDon",
        target: {
          player: "self",
          zones: ["leader"],
          count: { amount: 1 },
          filters: [{ filter: "name", value: "Roronoa Zoro" }],
        },
        count: { amount: 3, upTo: true },
        donState: "rested",
      },
    ]);
  });

  // ── addToLife — character to Life face-up ──

  test("addToLife: opponent's Character to Life face-up", () => {
    const result = parseActions(
      "Add up to 1 of your opponent's Characters with a cost of 3 or less to the top or bottom of your opponent's Life cards face-up",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed[0]).toMatchObject({
      action: "addToLife",
      position: "top",
      faceUp: true,
    });
    expect(result.parsed[0]).toHaveProperty("target.player", "opponent");
    expect(result.parsed[0]).toHaveProperty("target.zones", ["character"]);
  });

  test("addToLife: Character to owner's Life face-up", () => {
    const result = parseActions(
      "Add up to 1 Character with a cost of 8 or less to the top or bottom of the owner's Life cards face-up",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed[0]).toMatchObject({
      action: "addToLife",
      faceUp: true,
    });
  });

  test("addToLife: add 1 card from deck (without 'up to')", () => {
    const result = parseActions(
      "add 1 card from the top of your deck to the top of your Life cards",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "addToLife",
        target: {
          player: "self",
          zones: ["deck"],
          count: { amount: 1 },
        },
        position: "top",
      },
    ]);
  });

  // ── removeFromLife — top or bottom source ──

  test("removeFromLife: add from top or bottom of Life to hand", () => {
    const result = parseActions(
      "add 1 card from the top or bottom of your Life cards to your hand",
    );
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

  test("removeFromLife: opponent adds from Life to their hand", () => {
    const result = parseActions(
      "your opponent adds 1 card from the top of their Life cards to their hand",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "removeFromLife",
        player: "opponent",
        count: { amount: 1 },
        destination: "hand",
      },
    ]);
  });

  // ── Secondary split / Disclaimer fixes ──

  test("secondary split: period followed by [TriggerBracket] splits correctly", () => {
    const effects = buildCardEffects(
      "[On Play] Add up to 1 DON!! card from your DON!! deck and set it as active.[When Attacking] Draw 1 card.",
    );
    expect(effects).toBeDefined();
    expect(effects!.effects).toHaveLength(2);
    expect(effects!.effects![0]!.trigger).toBe("onPlay");
    expect(effects!.effects![0]!.actions[0]).toMatchObject({ action: "addDon" });
    expect(effects!.effects![1]!.trigger).toBe("whenAttacking");
    expect(effects!.effects![1]!.actions[0]).toMatchObject({ action: "draw" });
  });

  test("Disclaimer text is stripped from segments", () => {
    const effects = buildCardEffects(
      "[On Play] Draw 2 cards.Disclaimer: This card was reprinted from the original set with changes to the copyright information.",
    );
    expect(effects).toBeDefined();
    expect(effects!.effects).toHaveLength(1);
    expect(effects!.effects![0]!.actions).toEqual([{ action: "draw", player: "self", amount: 2 }]);
  });

  // ── Real card integration ──

  test("real card: OP13-023 Uta — setActive + playRestriction compound", () => {
    const effects = buildCardEffects(
      "[On Play] Set up to 2 of your DON!! cards as active. Then, you cannot play Character cards with a base cost of 5 or more during this turn.\n[On K.O.] Play up to 1 Character card with a cost of 5 or less from your hand rested.",
    );
    expect(effects).toBeDefined();
    const onPlay = effects!.effects!.find((e) => e.trigger === "onPlay")!;
    expect(onPlay.actions).toHaveLength(2);
    expect(onPlay.actions[0]).toMatchObject({ action: "setActive" });
    expect(onPlay.actions[1]).toMatchObject({ action: "playRestriction" });
  });

  test("real card: OP04-031 Doflamingo — freeze Leader and Character cards", () => {
    const effects = buildCardEffects(
      "[On Play] Up to a total of 3 of your opponent's rested Leader and Character cards will not become active in your opponent's next Refresh Phase.",
    );
    expect(effects).toBeDefined();
    expect(effects!.effects![0]!.actions[0]).toMatchObject({
      action: "freeze",
      target: {
        player: "opponent",
        zones: ["leader", "character"],
        count: { amount: 3, upTo: true },
      },
    });
  });

  test("real card: EB02-015 Jewelry Bonney — freeze then setActive at end of turn", () => {
    const effects = buildCardEffects(
      "[On Play] Up to 1 of your opponent's rested Characters will not become active in your opponent's next Refresh Phase. Then, set up to 1 of your DON!! cards as active at the end of this turn.",
    );
    expect(effects).toBeDefined();
    expect(effects!.effects).toHaveLength(1);
    const block = effects!.effects![0]!;
    expect(block.actions).toHaveLength(2);
    expect(block.actions[0]).toMatchObject({ action: "freeze" });
    expect(block.actions[1]).toMatchObject({ action: "setActive" });
  });
});
