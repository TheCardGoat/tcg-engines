import type { CardEffect } from "@tcg/gundam-types";
import { describe, expect, it } from "vite-plus/test";
import {
  createMockBase,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../index.ts";

const substituteBaseRestWithSelf: CardEffect = {
  type: "substitution",
  activation: {},
  directives: [{ action: { action: "substituteBaseRestWithSelf" } }],
  sourceText: "When your Unit effect would rest your Base, you may rest this Unit instead.",
};

const stagedAbility: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [
    {
      action: { action: "drawThenDiscard", drawCount: 1, discardCount: 1 },
    },
    {
      action: {
        action: "resolveThenQueue",
        first: {
          action: "rest",
          target: { owner: "friendly", cardType: "base", count: 1 },
        },
        followUp: {
          type: "triggered",
          activation: { timing: [] },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: 1,
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "Then choose 1 enemy Unit. Deal 1 damage to it.",
        },
      },
    },
  ],
  sourceText:
    "Draw 1, then discard 1. Choose 1 friendly Base and rest it. Then choose 1 enemy Unit and deal 1 damage to it.",
};

describe("resolveThenQueue nested choice ordering", () => {
  it("resolves the prerequisite, its substitution, and the follow-up before an unrelated choice", () => {
    const source = createMockUnit({ name: "Staged Source", effects: [stagedAbility] });
    const substitute = createMockUnit({
      name: "Base-rest Substitute",
      effects: [substituteBaseRestWithSelf],
    });
    const base = createMockBase({ name: "Friendly Base" });
    const enemy = createMockUnit({ name: "Enemy Unit", hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [source, substitute], baseSection: [base], deck: 2 },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [sourceId, substituteId] = p1.getCardsInZone("battleArea");
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.activateAbility(sourceId!, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: sourceId,
      legalTargetIds: [baseId],
    });
    expectSuccess(p1.resolveEffect({ targets: [baseId] }));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: substituteId,
      legalTargetIds: expect.arrayContaining([substituteId, baseId]),
    });
    expect(p1.isExhausted(baseId)).toBe(false);
    expect(p1.isExhausted(substituteId!)).toBe(false);
    expect(p2.getDamage(enemyId)).toBe(0);
    expectSuccess(p1.resolveEffect({ targets: [substituteId!] }));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: sourceId,
      legalTargetIds: [enemyId],
    });
    expect(p1.isExhausted(baseId)).toBe(false);
    expect(p1.isExhausted(substituteId!)).toBe(true);
    expect(p2.getDamage(enemyId)).toBe(0);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(1);
    const discardChoice = p1.getBoardView().pendingChoice;
    if (discardChoice?.kind !== "targetSelection") {
      throw new Error("Expected the earlier discard choice after the staged follow-up");
    }
    expect(discardChoice.legalTargetIds).toEqual(p1.getHand());
    const drawnCardId = p1.getHand()[0]!;
    expectSuccess(p1.resolveEffect({ targets: [drawnCardId] }));

    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getCardZone(drawnCardId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
