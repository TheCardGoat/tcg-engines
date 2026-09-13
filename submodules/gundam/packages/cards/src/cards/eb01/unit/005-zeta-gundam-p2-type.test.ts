import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01ZetaGundamP2Type005 } from "./005-zeta-gundam-p2-type.ts";

describe("Zeta Gundam Ⅲ P2 Type (EB01-005)", () => {
  it("【Deploy】 activates only the chosen other player's rested Unit and draws exactly 1", () => {
    const friendly = createMockUnit({ name: "Friendly Rested Unit" });
    const enemy = createMockUnit({ name: "Enemy Rested Unit" });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01ZetaGundamP2Type005],
        play: [{ card: friendly, exhausted: true }],
        deck: 2,
        resourceArea: activeResources(7),
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.deployUnit(eb01ZetaGundamP2Type005));
    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.isExhausted(enemyId)).toBe(false);
    expect(p1.isExhausted(friendlyId)).toBe(true);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
    expect(p1.getHand()).toHaveLength(1);
  });

  it("does not draw when no rested Unit belonging to another player can be chosen", () => {
    const engine = GundamTestEngine.create({
      hand: [eb01ZetaGundamP2Type005],
      deck: 2,
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.deployUnit(eb01ZetaGundamP2Type005));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
  });
});
