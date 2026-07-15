import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "../../../index.ts";

const discardForRest: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  cost: {
    discardCount: 1,
    discardFilter: {
      owner: "friendly",
      zone: "hand",
      cardType: "unit",
      count: 1,
      attributeFilters: [{ attribute: "trait", comparison: "includes", value: "zeon" }],
    },
  },
  directives: [
    {
      action: {
        action: "rest",
        target: { owner: "opponent", cardType: "unit", state: "active", count: 1 },
      },
    },
  ],
  sourceText: "Discard 1 Zeon Unit card: Rest 1 active enemy Unit.",
};

const drawAbility: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [{ action: { action: "draw", count: 1 } }],
  sourceText: "【Activate·Main】Draw 1.",
};

describe("activateAbility discard-cost choice", () => {
  it("does not offer the activation when no eligible discard cost exists", () => {
    const source = createMockUnit({ name: "Cost Source", effects: [discardForRest] });
    const enemy = createMockUnit({ name: "Rest Target" });
    const engine = GundamTestEngine.create({ play: [source] }, { play: [enemy] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expect(p1.getMoveProcedure("activateAbility", { cardId: sourceId })).toEqual([]);
    expectFailure(p1.activateAbility(sourceId, 0), "COST_NOT_PAYABLE");
  });

  it("does not offer or pay the discard cost when the mandatory effect target is absent", () => {
    const source = createMockUnit({ name: "Cost Source", effects: [discardForRest] });
    const eligibleCost = createMockUnit({ name: "Zeon Cost", traits: ["zeon"] });
    const engine = GundamTestEngine.create({ play: [source], hand: [eligibleCost] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const costId = p1.getHand()[0]!;

    expect(p1.getMoveProcedure("activateAbility", { cardId: sourceId })).toEqual([]);
    expectFailure(p1.activateAbility(sourceId, 0, { targets: [costId] }), "NO_LEGAL_TARGETS");

    expect(p1.getCardZone(costId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("rejects an opponent's in-play ability source", () => {
    const source = createMockUnit({ name: "Opponent Source", effects: [drawAbility] });
    const engine = GundamTestEngine.create({ deck: 3 }, { play: [source], deck: 3 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
    const handBefore = p1.getBoardView().players[PLAYER_ONE]!.handCount;

    expect(p1.getMoveProcedure("activateAbility", { cardId: sourceId })).toEqual([]);
    expectFailure(p1.activateAbility(sourceId, 0), "NOT_EFFECT_CONTROLLER");

    expect(p1.getBoardView().players[PLAYER_ONE]!.handCount).toBe(handBefore);
  });

  it("rejects an ability source in its controller's hand", () => {
    const source = createMockUnit({ name: "Hand Source", effects: [drawAbility] });
    const engine = GundamTestEngine.create({ hand: [source], deck: 3 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getHand()[0]!;

    expect(p1.getMoveProcedure("activateAbility", { cardId: sourceId })).toEqual([]);
    expectFailure(p1.activateAbility(sourceId, 0), "ABILITY_SOURCE_NOT_IN_PLAY");

    expect(p1.getCardZone(sourceId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("publishes eligible cost cards and pays with the card the player selected", () => {
    const source = createMockUnit({ name: "Cost Source", effects: [discardForRest] });
    const firstEligible = createMockUnit({ name: "First Zeon", traits: ["zeon"] });
    const secondEligible = createMockUnit({ name: "Second Zeon", traits: ["zeon"] });
    const ineligible = createMockUnit({ name: "Federation Unit", traits: ["earth federation"] });
    const enemy = createMockUnit({ name: "Rest Target" });
    const engine = GundamTestEngine.create(
      { play: [source], hand: [firstEligible, secondEligible, ineligible] },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [firstEligibleId, secondEligibleId, ineligibleId] = p1.getHand();
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expect(p1.getMoveProcedure("activateAbility", { cardId: sourceId, effectIndex: 0 })).toEqual([
      {
        kind: "selectTarget",
        role: "cost",
        candidateIds: [firstEligibleId, secondEligibleId],
        minTargets: 1,
        maxTargets: 1,
      },
    ]);
    expectFailure(
      p1.activateAbility(sourceId, 0, { targets: [ineligibleId!] }),
      "WRONG_TARGET_COUNT",
    );

    expectSuccess(p1.activateAbility(sourceId, 0, { targets: [secondEligibleId!] }));

    expect(p1.getCardsInZone("trash")).toEqual([secondEligibleId]);
    expect(p1.getHand()).toEqual(expect.arrayContaining([firstEligibleId, ineligibleId]));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });

    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.isExhausted(enemyId)).toBe(true);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
