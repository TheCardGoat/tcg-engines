import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Zakrello028 } from "./028-zakrello.ts";

describe("Zakrello (GD04-028)", () => {
  it("【Attack】 lets the chosen active enemy Unit block the attack", () => {
    const enemy = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [gd04Zakrello028] }, { play: [enemy] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const zakrelloId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(zakrelloId, "direct"));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      sourceCardId: zakrelloId,
      minTargets: 1,
      maxTargets: 1,
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getVisibleCard(enemyId)?.keywords).toContain("Blocker");
    expect(p2.getBoardView().step).toBe("block-step");
    expectSuccess(p2.declareBlock(enemyId));

    expect(p2.isExhausted(enemyId)).toBe(true);
  });
});
