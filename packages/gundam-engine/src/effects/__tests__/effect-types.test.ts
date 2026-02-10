/**
 * Gundam Effect Type System Tests
 *
 * Tests for effect type definitions, type guards, and builder functions.
 */

import { describe, expect, it } from "bun:test";
import type {
  AmountExpression,
  Condition,
  Cost,
  Effect,
  EffectTarget,
  UnitSelector,
} from "../effect-types";
import {
  addResources,
  addShield,
  attachAsPilot,
  battle,
  breakShield,
  changeController,
  choice,
  choiceOption,
  conditional,
  copy,
  counter,
  createToken,
  damage,
  destroy,
  discard,
  doTimes,
  draw,
  flip,
  forEach,
  gainAbility,
  gainControl,
  grantKeyword,
  heal,
  ifYouDo,
  isAmountExpression,
  isCombatEffect,
  isControlFlowEffect,
  isStatModifyingEffect,
  look,
  loseAbility,
  loseKeyword,
  modifyAP,
  modifyHP,
  optional,
  pairPilot,
  playFrom,
  playResource,
  preventDamage,
  redirectDamage,
  removeFromGame,
  repeatWhile,
  rest,
  restForResource,
  returnToHand,
  reveal,
  searchDeck,
  searchPilot,
  sendToTrash,
  sequence,
  setAP,
  setHP,
  shuffle,
  stand,
  swapStats,
  unpairPilot,
  untilEndOfTurn,
} from "../effect-types";

describe("Effect Builders - Card Manipulation", () => {
  it("should create a draw effect", () => {
    const effect = draw(1);
    expect(effect).toEqual({ type: "draw", amount: 1 });
  });

  it("should create a draw effect with player target", () => {
    const effect = draw(2, "opponent");
    expect(effect).toEqual({ type: "draw", amount: 2, player: "opponent" });
  });

  it("should create a discard effect", () => {
    const effect = discard(1, "self");
    expect(effect).toEqual({ type: "discard", amount: 1, player: "self" });
  });

  it("should create a search deck effect", () => {
    const effect = searchDeck("hand", { cardName: "RX-78-2 Gundam" });
    expect(effect.type).toBe("search-deck");
    expect(effect.destination).toBe("hand");
  });

  it("should create a return to hand effect", () => {
    const effect = returnToHand("chosen-unit");
    expect(effect).toEqual({ type: "return-to-hand", target: "chosen-unit" });
  });

  it("should create a send to trash effect", () => {
    const effect = sendToTrash("this");
    expect(effect).toEqual({ type: "send-to-trash", target: "this" });
  });
});

describe("Effect Builders - Combat", () => {
  it("should create a damage effect", () => {
    const effect = damage(3, "chosen-unit");
    expect(effect).toEqual({
      type: "damage",
      amount: 3,
      target: "chosen-unit",
    });
  });

  it("should create a heal effect", () => {
    const effect = heal(2, "this");
    expect(effect).toEqual({ type: "heal", amount: 2, target: "this" });
  });

  it("should create a heal all effect", () => {
    const effect = heal("all", "this");
    expect(effect).toEqual({ type: "heal", amount: "all", target: "this" });
  });

  it("should create a destroy effect", () => {
    const effect = destroy("chosen-unit");
    expect(effect).toEqual({ type: "destroy", target: "chosen-unit" });
  });

  it("should create a rest effect", () => {
    const effect = rest("chosen-unit");
    expect(effect).toEqual({ type: "rest", target: "chosen-unit" });
  });

  it("should create a stand effect", () => {
    const effect = stand("this");
    expect(effect).toEqual({ type: "stand", target: "this" });
  });

  it("should create a battle effect", () => {
    const effect = battle("this", "chosen-unit");
    expect(effect).toEqual({
      type: "battle",
      attacker: "this",
      defender: "chosen-unit",
    });
  });

  it("should create a prevent damage effect", () => {
    const effect = preventDamage("this", 2, "turn");
    expect(effect).toEqual({
      type: "prevent-damage",
      target: "this",
      amount: 2,
      duration: "turn",
    });
  });
});

describe("Effect Builders - Stat Modification", () => {
  it("should create a modify AP effect", () => {
    const effect = modifyAP(2, "this", "turn");
    expect(effect).toEqual({
      type: "modify-ap",
      amount: 2,
      target: "this",
      duration: "turn",
    });
  });

  it("should create a modify HP effect", () => {
    const effect = modifyHP(1, "each-friendly-unit");
    expect(effect).toEqual({
      type: "modify-hp",
      amount: 1,
      target: "each-friendly-unit",
    });
  });

  it("should create a set AP effect", () => {
    const effect = setAP(5, "this");
    expect(effect).toEqual({ type: "set-ap", amount: 5, target: "this" });
  });

  it("should create a set HP effect", () => {
    const effect = setHP(10, "this");
    expect(effect).toEqual({ type: "set-hp", amount: 10, target: "this" });
  });

  it("should create a swap stats effect", () => {
    const effect = swapStats("this", "chosen-unit");
    expect(effect).toEqual({
      type: "swap-stats",
      target1: "this",
      target2: "chosen-unit",
    });
  });
});

describe("Effect Builders - Resources", () => {
  it("should create an add resources effect", () => {
    const effect = addResources(2, "self", true);
    expect(effect).toEqual({
      type: "add-resources",
      amount: 2,
      player: "self",
      active: true,
    });
  });
});

describe("Effect Builders - Pilot and Pairing", () => {
  it("should create a pair pilot effect", () => {
    const effect = pairPilot("chosen-pilot", "this");
    expect(effect).toEqual({
      type: "pair-pilot",
      pilot: "chosen-pilot",
      unit: "this",
    });
  });

  it("should create an unpair pilot effect", () => {
    const effect = unpairPilot("this");
    expect(effect).toEqual({ type: "unpair-pilot", target: "this" });
  });

  it("should create a search pilot effect", () => {
    const effect = searchPilot("Amuro Ray", "hand", true);
    expect(effect).toEqual({
      type: "search-pilot",
      pilotName: "Amuro Ray",
      destination: "hand",
      reveal: true,
    });
  });
});

describe("Effect Builders - Shields", () => {
  it("should create an add shield effect", () => {
    const effect = addShield(1, "self");
    expect(effect).toEqual({ type: "add-shield", amount: 1, player: "self" });
  });

  it("should create a break shield effect", () => {
    const effect = breakShield("opponent", 1);
    expect(effect).toEqual({
      type: "break-shield",
      target: "opponent",
      amount: 1,
    });
  });
});

describe("Effect Builders - Keywords", () => {
  it("should create a grant keyword effect", () => {
    const effect = grantKeyword("Intercept", "this", "turn");
    expect(effect).toEqual({
      type: "grant-keyword",
      keyword: "Intercept",
      target: "this",
      duration: "turn",
    });
  });

  it("should create a lose keyword effect", () => {
    const effect = loseKeyword("Intercept", "this");
    expect(effect).toEqual({
      type: "lose-keyword",
      keyword: "Intercept",
      target: "this",
    });
  });
});

describe("Effect Builders - Tokens", () => {
  it("should create a create token effect", () => {
    const token = {
      name: "Zaku II",
      cardType: "UNIT" as const,
      level: 2,
      cost: 2,
      ap: 3,
      hp: 3,
    };
    const effect = createToken(token, {
      location: "battleArea",
      controller: "self",
    });
    expect(effect.type).toBe("create-token");
    expect(effect.token).toEqual(token);
  });
});

describe("Effect Builders - Control Flow", () => {
  it("should create a sequence effect", () => {
    const effect = sequence(draw(1), damage(2, "chosen-unit"));
    expect(effect).toEqual({
      type: "sequence",
      effects: [
        { type: "draw", amount: 1 },
        { type: "damage", amount: 2, target: "chosen-unit" },
      ],
    });
  });

  it("should create a choice effect", () => {
    const effect = choice(
      { label: "Draw a card", effect: draw(1) },
      { label: "Deal 2 damage", effect: damage(2, "chosen-unit") },
    );
    expect(effect.type).toBe("choice");
    expect(effect.options).toHaveLength(2);
  });

  it("should create an optional effect", () => {
    const effect = optional(draw(1), "self");
    expect(effect).toEqual({
      type: "optional",
      effect: { type: "draw", amount: 1 },
      player: "self",
    });
  });

  it("should create a conditional effect", () => {
    const condition = { turn: 3 };
    const effect = conditional(condition, draw(2), draw(1));
    expect(effect).toEqual({
      type: "conditional",
      condition,
      then: { type: "draw", amount: 2 },
      else: { type: "draw", amount: 1 },
    });
  });

  it("should create a for each effect", () => {
    const effect = forEach("each-friendly-unit", rest("this"));
    expect(effect).toEqual({
      type: "for-each",
      target: "each-friendly-unit",
      effect: { type: "rest", target: "this" },
    });
  });

  it("should create a do times effect", () => {
    const effect = doTimes(3, draw(1));
    expect(effect).toEqual({
      type: "do-times",
      times: 3,
      effect: { type: "draw", amount: 1 },
    });
  });

  it("should create a repeat while effect", () => {
    const condition = { playerHas: { resources: 5 } };
    const effect = repeatWhile(condition, draw(1), 5);
    expect(effect).toEqual({
      type: "repeat-while",
      condition,
      effect: { type: "draw", amount: 1 },
      maxTimes: 5,
    });
  });

  it("should create an if you do effect", () => {
    const cost = { discard: 1 };
    const effect = ifYouDo(cost, damage(3, "chosen-unit"));
    expect(effect).toEqual({
      type: "if-you-do",
      cost,
      then: { type: "damage", amount: 3, target: "chosen-unit" },
    });
  });

  it("should create an until end of turn effect", () => {
    const innerEffect = modifyAP(2, "this");
    const effect = untilEndOfTurn(innerEffect);
    expect(effect).toEqual({
      type: "until-end-of-turn",
      effect: innerEffect,
    });
  });
});

describe("Effect Builders - Special", () => {
  it("should create a look effect", () => {
    const then = { draw: 1 };
    const effect = look(3, "deck", then, "self");
    expect(effect).toEqual({
      type: "look",
      amount: 3,
      from: "deck",
      then,
      player: "self",
    });
  });

  it("should create a play from effect", () => {
    const effect = playFrom("chosen-unit", "hand", { ignoreCost: true });
    expect(effect).toEqual({
      type: "play-from",
      target: "chosen-unit",
      from: "hand",
      ignoreCost: true,
    });
  });

  it("should create a gain ability effect", () => {
    const ability = {
      type: "triggered" as const,
      trigger: "ON_DEPLOY",
      effect: draw(1),
    };
    const effect = gainAbility(ability, "this", "permanent");
    expect(effect).toEqual({
      type: "gain-ability",
      ability,
      target: "this",
      duration: "permanent",
    });
  });

  it("should create a shuffle effect", () => {
    const effect = shuffle("self", "deck");
    expect(effect).toEqual({
      type: "shuffle",
      player: "self",
      deck: "deck",
    });
  });

  it("should create a reveal effect", () => {
    const effect = reveal("chosen-card", "hand");
    expect(effect).toEqual({
      type: "reveal",
      target: "chosen-card",
      from: "hand",
    });
  });

  it("should create a redirect damage effect", () => {
    const effect = redirectDamage("this", "chosen-unit", 2);
    expect(effect).toEqual({
      type: "redirect-damage",
      from: "this",
      to: "chosen-unit",
      amount: 2,
    });
  });

  it("should create a change controller effect", () => {
    const effect = changeController("chosen-unit", "self", "turn");
    expect(effect).toEqual({
      type: "change-controller",
      target: "chosen-unit",
      newController: "self",
      duration: "turn",
    });
  });

  it("should create a gain control effect", () => {
    const effect = gainControl("chosen-unit", "until-end-of-turn");
    expect(effect).toEqual({
      type: "gain-control",
      target: "chosen-unit",
      duration: "until-end-of-turn",
    });
  });

  it("should create a copy effect", () => {
    const effect = copy("chosen-unit", "this");
    expect(effect).toEqual({
      type: "copy",
      target: "chosen-unit",
      onto: "this",
    });
  });

  it("should create a flip effect", () => {
    const effect = flip("this", true);
    expect(effect).toEqual({
      type: "flip",
      target: "this",
      faceDown: true,
    });
  });

  it("should create a remove from game effect", () => {
    const effect = removeFromGame("chosen-unit");
    expect(effect).toEqual({
      type: "remove-from-game",
      target: "chosen-unit",
    });
  });

  it("should create a lose ability effect", () => {
    const effect = loseAbility("Intercept", "this", "turn");
    expect(effect).toEqual({
      type: "lose-ability",
      ability: "Intercept",
      target: "this",
      duration: "turn",
    });
  });

  it("should create a counter effect", () => {
    const effect = counter("current-ability");
    expect(effect).toEqual({
      type: "counter",
      target: "current-ability",
    });
  });

  it("should create a play resource effect", () => {
    const effect = playResource("hand", "chosen-card");
    expect(effect).toEqual({
      type: "play-resource",
      from: "hand",
      target: "chosen-card",
    });
  });

  it("should create a rest for resource effect", () => {
    const effect = restForResource("this");
    expect(effect).toEqual({
      type: "rest-for-resource",
      target: "this",
    });
  });
});

describe("Type Guards", () => {
  it("should identify control flow effects", () => {
    expect(isControlFlowEffect(sequence(draw(1)))).toBe(true);
    expect(isControlFlowEffect(choice({ effect: draw(1) }))).toBe(true);
    expect(isControlFlowEffect(conditional({ playerHas: {} }, draw(1)))).toBe(
      true,
    );
    expect(isControlFlowEffect(optional(draw(1)))).toBe(true);
    expect(isControlFlowEffect(forEach("this", draw(1)))).toBe(true);
    expect(isControlFlowEffect(doTimes(3, draw(1)))).toBe(true);
    expect(isControlFlowEffect(repeatWhile({ playerHas: {} }, draw(1)))).toBe(
      true,
    );
    expect(isControlFlowEffect(ifYouDo({ discard: 1 }, draw(1)))).toBe(true);
    expect(isControlFlowEffect(untilEndOfTurn(draw(1)))).toBe(true);
    expect(isControlFlowEffect(draw(1))).toBe(false);
    expect(isControlFlowEffect(damage(2, "this"))).toBe(false);
  });

  it("should identify stat modifying effects", () => {
    expect(isStatModifyingEffect(modifyAP(2, "this"))).toBe(true);
    expect(isStatModifyingEffect(modifyHP(2, "this"))).toBe(true);
    expect(isStatModifyingEffect(setAP(5, "this"))).toBe(true);
    expect(isStatModifyingEffect(setHP(10, "this"))).toBe(true);
    expect(isStatModifyingEffect(swapStats("this", "chosen-unit"))).toBe(true);
    expect(isStatModifyingEffect(draw(1))).toBe(false);
    expect(isStatModifyingEffect(damage(2, "this"))).toBe(false);
  });

  it("should identify combat effects", () => {
    expect(isCombatEffect(damage(2, "this"))).toBe(true);
    expect(isCombatEffect(heal(2, "this"))).toBe(true);
    expect(isCombatEffect(destroy("this"))).toBe(true);
    expect(isCombatEffect(rest("this"))).toBe(true);
    expect(isCombatEffect(stand("this"))).toBe(true);
    expect(isCombatEffect(battle("this", "chosen-unit"))).toBe(true);
    expect(isCombatEffect(preventDamage("this"))).toBe(true);
    expect(isCombatEffect(redirectDamage("this", "chosen-unit"))).toBe(true);
    expect(isCombatEffect(draw(1))).toBe(false);
    expect(isCombatEffect(modifyAP(2, "this"))).toBe(false);
  });

  it("should identify amount expressions", () => {
    expect(isAmountExpression(5)).toBe(false);
    expect(isAmountExpression({ count: "this" })).toBe(true);
    expect(isAmountExpression({ ap: "this" })).toBe(true);
    expect(isAmountExpression({ hp: "this" })).toBe(true);
    expect(isAmountExpression({ damage: "this" })).toBe(true);
    expect(isAmountExpression({ cost: "this" })).toBe(true);
    expect(isAmountExpression({ level: "this" })).toBe(true);
    expect(isAmountExpression({ resources: "self" })).toBe(true);
    expect(isAmountExpression({ cardsInHand: "self" })).toBe(true);
    expect(isAmountExpression({ cardsInTrash: "self" })).toBe(true);
    expect(isAmountExpression({ shields: "self" })).toBe(true);
    expect(isAmountExpression({ variable: "x" })).toBe(true);
  });
});

describe("Choice Option Builder", () => {
  it("should create a choice option without condition", () => {
    const option = choiceOption("Draw a card", draw(1));
    expect(option).toEqual({
      label: "Draw a card",
      effect: { type: "draw", amount: 1 },
    });
  });

  it("should create a choice option with condition", () => {
    const condition = { turn: 3 };
    const option = choiceOption("Deal 3 damage", damage(3, "this"), condition);
    expect(option).toEqual({
      label: "Deal 3 damage",
      effect: { type: "damage", amount: 3, target: "this" },
      condition,
    });
  });
});
