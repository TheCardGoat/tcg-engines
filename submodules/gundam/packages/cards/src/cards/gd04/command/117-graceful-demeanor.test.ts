import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GracefulDemeanor117 } from "./117-graceful-demeanor.ts";

describe("Graceful Demeanor (GD04-117)", () => {
  it("【Action】returns 1 to 2 enemy Units that are Lv.3 or lower to hand", () => {
    const enemyA = createMockUnit({ level: 3 });
    const enemyB = createMockUnit({ level: 2 });
    const engine = GundamTestEngine.create(
      { hand: [gd04GracefulDemeanor117], resourceArea: activeResources(4) },
      { play: [enemyA, enemyB] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyAId, enemyBId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd04GracefulDemeanor117, { targets: [enemyAId!, enemyBId!] }));

    expect(p2.getHand()).toEqual(expect.arrayContaining([enemyAId, enemyBId]));
  });
});
