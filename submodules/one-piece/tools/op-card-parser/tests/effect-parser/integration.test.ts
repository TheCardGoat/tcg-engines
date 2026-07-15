import { expect, test, describe } from "vite-plus/test";
import { buildCardEffects, parseActions, parseEffectText } from "../../src/effect-parser/index.ts";

describe("real card integration tests", () => {
  test("OP01-001 Roronoa Zoro leader", () => {
    const result = parseEffectText(
      "[DON!! x1] [Your Turn] All of your Characters gain +1000 power.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.triggers).toEqual([]);
    expect(seg.conditions).toEqual([
      { condition: "donAttached", amount: 1 },
      { condition: "turn", value: "your" },
    ]);
    expect(seg.rawActionText).toBe("All of your Characters gain +1000 power.");
  });

  test("OP01-003 Monkey.D.Luffy leader with errata", () => {
    const result = parseEffectText(
      '[Activate:Main] [Once Per Turn] (4) (You may rest the specified number of DON!! cards in your cost area.): Set up to 1 of your "Supernova" or "Straw Hat Crew" type Character cards with a cost of 5 or less as active. It gains +1000 power during this turn. This card has been officially errata\'d.',
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.triggers).toEqual(["activateMain"]);
    expect(seg.oncePerTurn).toBe(true);
    expect(seg.costs).toEqual([{ type: "restDon", amount: 4 }]);
    expect(result.errata).toBeDefined();
    expect(seg.rawActionText).not.toContain("errata");
  });

  test("OP06-022 Yamato leader multi-line", () => {
    const result = parseEffectText(
      "[Double Attack] (This card deals 2 damage.)\n[Activate:Main] [Once Per Turn] If your opponent has 3 or less Life cards, give up to 2 rested DON!! cards to 1 of your Characters.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.triggers).toEqual(["activateMain"]);
    expect(seg.oncePerTurn).toBe(true);
    expect(seg.rawActionText).toContain("If your opponent has 3 or less Life cards");
  });

  test("OP02-001 Edward Newgate leader", () => {
    const result = parseEffectText(
      "[End of Your Turn] Add 1 card from the top of your Life cards to your hand.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["endOfYourTurn"]);
  });

  test("OP14-069 Doflamingo with DON!! -3 + Choose one", () => {
    const result = parseEffectText(
      "[On Play] DON!! -3: Choose one:\n•If your Leader has the {Donquixote Pirates} type, K.O. up to 1 of your opponent's Characters with a cost of 8 or less.\n•Up to 3 of your opponent's Characters with a cost of 7 or less cannot be rested until the end of your opponent's next End Phase.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.triggers).toEqual(["onPlay"]);
    expect(seg.costs).toEqual([{ type: "returnDon", amount: 3 }]);
    expect(seg.choiceItems).toHaveLength(2);
  });

  test("OP06-062 Vinsmoke Judge multi-effect", () => {
    const result = parseEffectText(
      '[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.) You may trash 2 cards from your hand: Play up to 4 "GERMA 66" type Character cards with different card names and 4000 power or less from your trash.\n[Activate:Main] [Once Per Turn] DON!! -1: Rest up to 1 of your opponent\'s DON!! cards.',
    );
    expect(result.segments).toHaveLength(2);
    expect(result.segments[0]!.triggers).toEqual(["onPlay"]);
    expect(result.segments[1]!.triggers).toEqual(["activateMain"]);
    expect(result.segments[1]!.costs).toEqual([{ type: "returnDon", amount: 1 }]);
  });

  test("OP05-001 Sabo leader with DON!! x1 + Opponent's Turn + Once Per Turn", () => {
    const result = parseEffectText(
      "[DON!! x1][Opponent's Turn][Once Per Turn] If your Character with 5000 power or more would be K.O.'d, you may give that Character -1000 power during this turn instead of that Character being K.O.'d.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.conditions).toEqual([
      { condition: "donAttached", amount: 1 },
      { condition: "turn", value: "opponent" },
    ]);
    expect(seg.oncePerTurn).toBe(true);
    expect(seg.rawActionText).toContain("If your Character with 5000 power");
  });

  test("OP03-017 Cross Fire with [Main] / [Counter] and [Trigger]", () => {
    const text =
      "[Main] / [Counter] If your Leader's type includes \"Whitebeard Pirates\", give up to 1 of your opponent's Characters -4000 power during this turn.\n[Trigger] Activate this card's [Main] effect.";
    const result = parseEffectText(text);
    // [Trigger] line should be stripped
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["main", "counter"]);
  });

  test("EB02-057 King with DON!! 2 (no minus sign)", () => {
    const result = parseEffectText(
      "[Activate: Main] [Once Per Turn] DON!! 2: Choose one:\n• If you have 5 or less cards in your hand, draw 1 card.\n• Give up to 1 of your opponent's Characters 2 cost during this turn.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.costs).toEqual([{ type: "returnDon", amount: 2 }]);
    expect(seg.choiceItems).toHaveLength(2);
  });
});

describe("real card integration — batch 6", () => {
  test("OP01-060 Dracule Mihawk — K.O. with total power", () => {
    const effects = buildCardEffects(
      "[On Play] K.O. up to 2 of your opponent's Characters with a total power of 4000 or less.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.actions[0]).toMatchObject({
      action: "ko",
      target: {
        totalConstraint: { property: "power", comparison: "lte", value: 4000 },
      },
    });
  });

  test("OP14-069 Doflamingo — choose one with DON!! cost", () => {
    const effects = buildCardEffects(
      "[On Play] DON!! -3: Choose one:\n• K.O. up to 1 of your opponent's Characters with a cost of 7 or less.\n• Rest up to 2 of your opponent's Characters.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.actions[0]).toMatchObject({ action: "choice" });
    if (block.actions[0]!.action === "choice") {
      expect(block.actions[0].options).toHaveLength(2);
    }
  });

  test("OP02-093 Rebecca — negate effect during this turn", () => {
    const effects = buildCardEffects(
      "[Counter] Negate the effect of up to 1 of your opponent's Leader or Character cards during this turn.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.trigger).toBe("counter");
    expect(block.actions[0]).toMatchObject({
      action: "negateEffects",
      duration: "thisTurn",
    });
  });

  test("card with Activate this card's [Main] effect", () => {
    const effects = buildCardEffects("[When Attacking] Activate this card's [Main] effect.");
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.actions[0]).toMatchObject({
      action: "activateEffect",
      effectTrigger: "main",
    });
  });

  test("multi-target return to owner's hand", () => {
    const effects = buildCardEffects(
      "[On Play] Return up to 1 Character with a cost of 8 or less and up to 1 Character with a cost of 3 or less to the owner's hand.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.actions).toHaveLength(2);
    expect(block.actions[0]).toMatchObject({ action: "returnToHand" });
    expect(block.actions[1]).toMatchObject({ action: "returnToHand" });
  });

  test("cannot attack until end of opponent's next turn", () => {
    const effects = buildCardEffects(
      "[On Play] Up to 1 of your opponent's rested Leader cannot attack until the end of your opponent's next turn.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.actions[0]).toMatchObject({
      action: "cannotAttack",
      duration: "untilEndOfOpponentNextTurn",
    });
  });
});

// ── Search/play variant tests ──

describe("real card integration — batch 7", () => {
  test("OP01-013 Nami — look at + add to hand + place rest", () => {
    const effects = buildCardEffects(
      "[On Play] If your Leader is multicolored, look at 3 cards from the top of your deck and add up to 1 card to your hand. Then, place the rest at the top of your deck in any order.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.conditions).toBeDefined();
    expect(block.actions).toHaveLength(1);
    expect(block.actions[0]).toMatchObject({
      action: "search",
      lookCount: 3,
      remainderPosition: "top",
    });
  });

  test("OP04-044 Brook — reveal + add to hand + trash rest", () => {
    const effects = buildCardEffects(
      "[When Attacking] Look at 3 cards from the top of your deck; reveal up to 1 [Navy] type card other than [Brannew] and add it to your hand. Then, trash the rest.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.actions[0]).toMatchObject({
      action: "search",
      remainderPosition: "trash",
    });
  });

  test("K.O. and gain Rush compound", () => {
    const effects = buildCardEffects(
      "[On Play] K.O. up to 1 of your opponent's Characters with a cost of 6 or less. This Character gains [Rush] during this turn.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.actions).toHaveLength(2);
    expect(block.actions[0]).toMatchObject({ action: "ko" });
    expect(block.actions[1]).toMatchObject({ action: "grantKeyword", keyword: "rush" });
  });

  test("Reveal + play + place rest at bottom", () => {
    const effects = buildCardEffects(
      "[On Play] Reveal 1 card from the top of your deck and play up to 1 Character with a cost of 9 or less other than [Sanji]. Then, place the rest at the bottom of your deck in any order.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.actions[0]).toMatchObject({
      action: "search",
      lookCount: 1,
      revealDestination: "character",
      remainderPosition: "bottom",
    });
  });
});

// ── Batch 8: When conditions, compound DON!!, keyword+power, add from trash ──

describe("real card integration — batch 8", () => {
  test("When Character attack deals damage + trash from deck", () => {
    const effects = buildCardEffects(
      "[Your Turn] When this Character's attack deals damage to your opponent's Life, you may trash 7 cards from the top of your deck.",
    );
    expect(effects).toBeDefined();
    // "When" converts to EffectBlock with whenDealsDamage trigger
    const block = effects!.effects![0]!;
    expect(block.trigger).toBe("whenDealsDamage");
    expect(block.actions[0]).toMatchObject({
      action: "trashFromDeck",
      player: "self",
      amount: 7,
    });
  });

  test("When Character is K.O.'d + opponent returns DON!!", () => {
    const effects = buildCardEffects(
      "[Your Turn] When this Character is K.O.'d, your opponent returns 2 DON!! cards from their field to their DON!! deck.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.trigger).toBe("onKo");
    expect(block.actions[0]).toMatchObject({
      action: "opponentReturnDon",
      amount: 2,
    });
  });

  test("When DON!! returned + draw", () => {
    const effects = buildCardEffects(
      "[Your Turn] When a DON!! card on your field is returned to your DON!! deck, draw 1 card.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.trigger).toBe("whenDonReturned");
    expect(block.actions[0]).toMatchObject({ action: "draw", amount: 1 });
  });

  test("When DON!! returned + addDon", () => {
    const effects = buildCardEffects(
      "[Your Turn] When a DON!! card on your field is returned to your DON!! deck, add up to 1 DON!! card from your DON!! deck and set it as active.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.trigger).toBe("whenDonReturned");
    expect(block.actions[0]).toMatchObject({
      action: "addDon",
      count: { amount: 1, upTo: true },
      state: "active",
    });
  });

  test("When DON!! returned + KO", () => {
    const effects = buildCardEffects(
      "[Your Turn] When a DON!! card on your field is returned to your DON!! deck, K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.trigger).toBe("whenDonReturned");
    expect(block.actions[0]).toMatchObject({ action: "ko" });
  });

  test("compound DON!! 0 or 3+ → addDon", () => {
    const effects = buildCardEffects(
      "[Once Per Turn] [Activate:Main] If you have 0 or 3 or more DON!! cards on your field, add up to 1 DON!! card from your DON!! deck and set it as active.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.conditions![0]).toMatchObject({
      condition: "compound",
      operator: "or",
    });
    expect(block.actions[0]).toMatchObject({ action: "addDon" });
  });

  test("If compound: lifeComparison + keyword + power", () => {
    const effects = buildCardEffects(
      "[DON!! x1] [Your Turn] If you have less Life cards than your opponent, this Character gains [Double Attack] and +1000 power.",
    );
    expect(effects).toBeDefined();
    // Permanent effect with condition
    const perm = effects!.permanentEffects![0]!;
    expect(perm.conditions).toBeDefined();
    expect(perm.actions).toHaveLength(2);
    expect(perm.actions[0]).toMatchObject({ action: "grantKeyword", keyword: "doubleAttack" });
    expect(perm.actions[1]).toMatchObject({ action: "modifyPower", value: 1000 });
  });

  test("Add from trash: [Laboon]", () => {
    const effects = buildCardEffects(
      "[On Play] Add up to 1 [Laboon] from your trash to your hand.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.trigger).toBe("onPlay");
    expect(block.actions[0]).toMatchObject({
      action: "returnToHand",
      target: {
        player: "self",
        zones: ["trash"],
        filters: [{ filter: "name", value: "Laboon" }],
      },
    });
  });

  test("cannotBeKod by opponent's effects and gains [Blocker]", () => {
    const effects = buildCardEffects(
      "[DON!! x1] [Your Turn] This Character cannot be K.O.'d by your opponent's effects and gains [Blocker].",
    );
    expect(effects).toBeDefined();
    const perm = effects!.permanentEffects![0]!;
    expect(perm.actions).toHaveLength(2);
    expect(perm.actions[0]).toMatchObject({
      action: "cannotBeKod",
      restriction: "byEffect",
    });
    expect(perm.actions[1]).toMatchObject({
      action: "grantKeyword",
      keyword: "blocker",
    });
  });

  test("all of your trait type Characters gain +2000 power", () => {
    const effects = buildCardEffects(
      "[DON!! x1] [Your Turn] All of your {SWORD} type Characters with a cost of 6 or less gain +2000 power.",
    );
    expect(effects).toBeDefined();
    const perm = effects!.permanentEffects![0]!;
    expect(perm.actions[0]).toMatchObject({
      action: "modifyPower",
      value: 2000,
      target: {
        player: "self",
        zones: ["character"],
        count: { amount: "all" },
        filters: [
          { filter: "trait", value: "SWORD" },
          { filter: "cost", comparison: "lte", value: 6 },
        ],
      },
    });
  });

  test("add trait type Character from trash", () => {
    const effects = buildCardEffects(
      '[On Play] If the number of DON!! cards on your field is equal to or less than the number on your opponent\'s field, add up to 1 "The Vinsmoke Family" type Character card from your trash to your hand.',
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.conditions![0]).toMatchObject({
      condition: "donFieldComparison",
      selfComparison: "lte",
    });
    expect(block.actions[0]).toMatchObject({
      action: "returnToHand",
      target: {
        player: "self",
        zones: ["trash"],
        filters: [
          { filter: "trait", value: "The Vinsmoke Family" },
          { filter: "cardCategory", value: "character" },
        ],
      },
    });
  });

  test("opponent must place card from hand (When event)", () => {
    const effects = buildCardEffects(
      "[Your Turn] When your opponent activates an Event, your opponent must place 1 card from their hand at the bottom of their deck.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.trigger).toBe("whenOpponentActivatesEvent");
    expect(block.actions[0]).toMatchObject({
      action: "returnToDeck",
      target: { player: "opponent", zones: ["hand"] },
      position: "bottom",
    });
  });

  test("lifeComparison + Double Attack parenthetical stripped", () => {
    const effects = buildCardEffects(
      "[DON!! x1] [Your Turn] If you have less Life cards than your opponent, this Character gains [Double Attack] and +1000 power. (This card deals 2 damage.)",
    );
    expect(effects).toBeDefined();
    const perm = effects!.permanentEffects![0]!;
    // Bracket conditions come first, inline last
    expect(perm.conditions).toHaveLength(3);
    expect(perm.conditions![0]).toMatchObject({ condition: "donAttached", amount: 1 });
    expect(perm.conditions![1]).toMatchObject({ condition: "turn", value: "your" });
    expect(perm.conditions![2]).toMatchObject({
      condition: "lifeComparison",
      selfComparison: "lt",
    });
    expect(perm.actions).toHaveLength(2);
    expect(perm.actions[0]).toMatchObject({ action: "grantKeyword", keyword: "doubleAttack" });
    expect(perm.actions[1]).toMatchObject({ action: "modifyPower", value: 1000 });
  });

  test("all of your trait Leader and Character cards gain power", () => {
    const effects = buildCardEffects(
      "[DON!! x2] [Your Turn] If you have 7 or more DON!! cards on your field, all of your {ODYSSEY} type Leader and Character cards gain +1000 power until the end of your opponent's next turn.",
    );
    expect(effects).toBeDefined();
    const perm = effects!.permanentEffects![0]!;
    // Bracket conditions: donAttached(2), turn("your"); inline: donFieldCount
    expect(perm.conditions![2]).toMatchObject({
      condition: "donFieldCount",
      comparison: "gte",
      value: 7,
    });
    expect(perm.actions[0]).toMatchObject({
      action: "modifyPower",
      value: 1000,
      duration: "untilEndOfOpponentNextTurn",
      target: {
        player: "self",
        zones: ["leader", "character"],
        count: { amount: "all" },
        filters: [{ filter: "trait", value: "ODYSSEY" }],
      },
    });
  });

  test("opponent rested Characters condition", () => {
    const effects = buildCardEffects(
      "[DON!! x1] [Your Turn] If your opponent has 2 or more rested Characters, this Character gains +2000 power.",
    );
    expect(effects).toBeDefined();
    const perm = effects!.permanentEffects![0]!;
    expect(perm.conditions![2]).toMatchObject({
      condition: "zoneCount",
      player: "opponent",
      zone: "character",
      comparison: "gte",
      value: 2,
      filters: [{ filter: "state", value: "rested" }],
    });
    expect(perm.actions[0]).toMatchObject({ action: "modifyPower", value: 2000 });
  });

  test("add from trash with color + excludeName", () => {
    const result = parseActions(
      "Add up to 1 red Character card other than [Uta] with a cost of 3 or less from your trash to your hand.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "returnToHand",
      target: {
        player: "self",
        zones: ["trash"],
        count: { amount: 1, upTo: true },
        filters: [
          { filter: "color", value: "red" },
          { filter: "cardCategory", value: "character" },
          { filter: "excludeName", value: "Uta" },
          { filter: "cost", comparison: "lte", value: 3 },
        ],
      },
    });
  });

  test("non-self cannotBeKod: your active Characters", () => {
    const effects = buildCardEffects(
      "[DON!! x1] [Your Turn] If this Character is rested, your active Characters with a base cost of 5 cannot be K.O.'d by effects.",
    );
    expect(effects).toBeDefined();
    const perm = effects!.permanentEffects![0]!;
    expect(perm.conditions![2]).toMatchObject({
      condition: "cardState",
      property: "state",
      value: "rested",
    });
    expect(perm.actions[0]).toMatchObject({
      action: "cannotBeKod",
      restriction: "byEffect",
      target: {
        player: "self",
        zones: ["character"],
        count: { amount: "all" },
      },
    });
  });

  // ── Batch 1 tests ──

  test("dynamic cost filter: K.O. with life-card-based cost", () => {
    const result = parseActions(
      "K.O. up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life cards.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "ko",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "dynamicCost", comparison: "lte", source: "opponentLifeCount" }],
      },
    });
  });

  test("dynamic cost filter: total life cards", () => {
    const result = parseActions(
      "K.O. up to 1 of your opponent's Characters with a cost equal to or less than the total of your and your opponent's Life cards.",
    );
    expect(result.parsed[0]).toMatchObject({
      action: "ko",
      target: {
        filters: [{ filter: "dynamicCost", comparison: "lte", source: "totalLifeCount" }],
      },
    });
  });

  test("canAttackActive: target with trait and duration", () => {
    const result = parseActions(
      "Up to 1 of your {SWORD} type Leader or Character cards can also attack active Characters during this turn.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "canAttackActive",
      duration: "thisTurn",
    });
  });

  test("replacement effect: trash from hand instead of K.O.", () => {
    const effects = buildCardEffects(
      "[On Your Opponent's Attack] [Once Per Turn] If this Character would be K.O.'d by an effect, you may trash 1 Event or Stage card from your hand instead.",
    );
    expect(effects).toBeDefined();
    expect(effects!.replacementEffects).toHaveLength(1);
    expect(effects!.replacementEffects![0]).toMatchObject({
      replacedEvent: "ko",
      replacementAction: {
        action: "trashFromHand",
        player: "self",
        amount: 1,
      },
    });
  });

  test("extra turn action", () => {
    const result = parseActions(
      "Place all of your Characters except this Character at the bottom of the owner's deck in any order. Then, take an extra turn after this one.",
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({ action: "returnToDeck", position: "bottom" });
    expect(result.parsed[1]).toMatchObject({ action: "extraTurn" });
  });

  test("deal damage action", () => {
    const result = parseActions("deal 1 damage to your opponent.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "dealDamage",
      player: "opponent",
      amount: 1,
    });
  });

  test("give DON!! cards: leader and character each", () => {
    const result = parseActions("Give your Leader and 1 Character up to 1 rested DON!! card each.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "giveDon",
      target: { player: "self", zones: ["leader", "character"], count: { amount: 1 } },
      count: { amount: 1, upTo: true },
      donState: "rested",
    });
  });

  test("redistribute DON!! cards", () => {
    const result = parseActions(
      "Give up to 2 total of your currently given DON!! cards to 1 of your Characters.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "redistributeDon",
      count: { amount: 2, upTo: true },
    });
  });

  test("cost reduction permanent", () => {
    const result = parseActions(
      "The cost of playing [Celestial Dragons] type Character cards with a cost of 2 or more from your hand will be reduced by 1.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "modifyCost",
      value: -1,
    });
  });

  test("cannot activate up to 1 blocker", () => {
    const result = parseActions(
      "Your opponent cannot activate up to 1 [Blocker] Character that has 4000 power or less during this turn.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "cannotActivate",
      keyword: "blocker",
      target: { count: { amount: 1, upTo: true } },
      duration: "thisTurn",
    });
  });

  test("opponent chosen trash", () => {
    const result = parseActions("Your opponent chooses 1 card from your hand; trash that card.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "trashFromHand",
      player: "self",
      amount: 1,
    });
  });

  test("K.O. all of opponent's Characters", () => {
    const result = parseActions("K.O. all of your opponent's Characters with a cost of 2 or less.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "ko",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: "all" },
        filters: [{ filter: "cost", comparison: "lte", value: 2 }],
      },
    });
  });

  test("rest all of opponent's Characters", () => {
    const result = parseActions("Rest all of your opponent's Characters.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "rest",
      target: { player: "opponent", zones: ["character"], count: { amount: "all" } },
    });
  });

  test("grant keyword with trailing condition", () => {
    const result = parseActions(
      "This Character gains [Double Attack] if you have 5 or more cards in your hand.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "grantKeyword",
      keyword: "doubleAttack",
      condition: { condition: "handCount", comparison: "gte", value: 5 },
    });
  });

  test("draw a card (singular form)", () => {
    const result = parseActions("Draw a card.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({ action: "draw", player: "self", amount: 1 });
  });

  test("draw with DON!! field condition", () => {
    const result = parseActions("Draw 1 card if you have 8 or more DON!! cards on your field.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "draw",
      amount: 1,
      condition: { condition: "donFieldCount", comparison: "gte", value: 8 },
    });
  });

  test("K.O. then add DON!! with comma-then split", () => {
    const result = parseActions(
      "K.O. up to 1 of your opponent's Characters with a cost of 2 or less, then add up to 1 DON!! card from your DON!! deck and set it as active.",
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({ action: "ko" });
    expect(result.parsed[1]).toMatchObject({ action: "addDon", state: "active" });
  });

  test("set cost of target to 0", () => {
    const result = parseActions(
      "Set the cost of up to 1 of your opponent's Characters with no base effect to 0 during this turn.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "modifyCost",
      value: 0,
    });
  });

  test("Draw 1 card when suffix event", () => {
    const effects = buildCardEffects(
      "[Your Turn] Draw 1 card when your opponent activates an Event.",
    );
    expect(effects).toBeDefined();
    const block = effects!.effects![0]!;
    expect(block.trigger).toBe("whenOpponentActivatesEvent");
    expect(block.actions[0]).toMatchObject({ action: "draw", amount: 1 });
  });
});
