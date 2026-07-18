import type { CardEffect, Zone } from "@tcg/gundam-types";
import { describe, expect, it } from "vite-plus/test";
import {
  createMockBase,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../index.ts";

function effectDamageSource(zone: Extract<Zone, "shieldArea" | "baseSection">, amount: number) {
  const effect: CardEffect = {
    type: "activated",
    activation: { timing: ["activate:main"] },
    directives: [
      {
        action: {
          action: "dealDamage",
          amount,
          target: {
            owner: "opponent",
            count: 1,
            attributeFilters: [{ attribute: "zone", comparison: "eq", value: zone }],
          },
        },
      },
    ],
    sourceText: `【Activate･Main】Deal ${amount} damage to 1 enemy ${zone}.`,
  };
  return createMockUnit({ name: "Effect Damage Source", effects: [effect] });
}

describe("effect-damage destruction management", () => {
  it("reveals a destroyed Shield for Burst without activating its hidden card effects", () => {
    const burst: CardEffect = {
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [{ action: { action: "deploySelf" } }],
      sourceText: "【Burst】Deploy this card.",
    };
    const hiddenReaction: CardEffect = {
      type: "triggered",
      activation: {
        timing: ["onEffectDamageReceived"],
        conditions: [{ type: "eventCardIsSelf" }],
      },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "When this Base receives effect damage, draw 1.",
    };
    const shield = createMockBase({ name: "Burst Shield", effects: [burst, hiddenReaction] });
    const source = effectDamageSource("shieldArea", 1);
    const engine = GundamTestEngine.create({ play: [source] }, { shieldArea: [shield], deck: 5 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const deckBefore = p2.getBoardView().players[PLAYER_TWO]!.deckCount;
    const handBefore = p2.getHand().length;

    expectSuccess(p1.activateAbility(sourceId, 0));
    const targetChoice = p1.getBoardView().pendingChoice;
    if (targetChoice?.kind !== "targetSelection") {
      throw new Error("Expected a visible Shield target choice");
    }
    const revealedShieldId = targetChoice.legalTargetIds[0]!;
    expectSuccess(p1.resolveEffect({ targets: [revealedShieldId] }));

    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
      sourceCardId: revealedShieldId,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(revealedShieldId)).toBe(`baseSection:${PLAYER_TWO}`);
    expect(p2.getBoardView().players[PLAYER_TWO]!.deckCount).toBe(deckBefore);
    expect(p2.getHand()).toHaveLength(handBefore);
  });

  it("uses a deployed Base's HP and fires its public Destroyed effect", () => {
    const destroyedDraw: CardEffect = {
      type: "triggered",
      activation: { timing: ["destroyed"] },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "【Destroyed】Draw 1.",
    };
    const base = createMockBase({ name: "Damaged Base", hp: 2, effects: [destroyedDraw] });
    const source = effectDamageSource("baseSection", 2);
    const engine = GundamTestEngine.create({ play: [source] }, { baseSection: [base], deck: 5 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p2.getCardsInZone("baseSection")[0]!;
    const deckBefore = p2.getBoardView().players[PLAYER_TWO]!.deckCount;
    const handBefore = p2.getHand().length;

    expectSuccess(p1.activateAbility(sourceId, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [baseId],
    });
    expectSuccess(p1.resolveEffect({ targets: [baseId] }));

    expect(p2.getCardZone(baseId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().players[PLAYER_TWO]!.deckCount).toBe(deckBefore - 1);
    expect(p2.getHand()).toHaveLength(handBefore + 1);
  });
});
