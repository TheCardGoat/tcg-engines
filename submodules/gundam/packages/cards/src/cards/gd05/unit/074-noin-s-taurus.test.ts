import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05NoinSTaurus074 } from "./074-noin-s-taurus.ts";

describe("Noin's Taurus (GD05-074)", () => {
  /** @behavioral-proof complete: Destroyed timing, draw-before-discard staging, exact discard count, visible choice, and chosen destination are public. */
  it("【Destroyed】 draws exactly 1 before requiring the owner to discard exactly 1", () => {
    const attacker = createMockUnit({ name: "Enemy attacker", ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        play: [gd05NoinSTaurus074],
        deck: 2,
        shieldArea: [createMockUnit({ name: "Friendly shield" })],
      },
      {
        play: [attacker],
        deck: 5,
        shieldArea: [createMockUnit({ name: "Enemy shield" })],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [sourceId]);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(attackerId, sourceId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected Noin's discard choice");
    expect(choice.legalTargetIds).toEqual(p1.getHand());
    expect(choice.minTargets).toBe(1);
    expect(choice.maxTargets).toBe(1);
    const discardedId = choice.legalTargetIds[0]!;
    expectSuccess(p1.resolveEffect({ targets: [discardedId] }));

    expect(p1.getCardZone(sourceId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getCardZone(discardedId)).toBe(`trash:${PLAYER_ONE}`);
  });
});
