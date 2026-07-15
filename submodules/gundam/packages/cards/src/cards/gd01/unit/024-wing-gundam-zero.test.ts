import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01WingGundamZero024 } from "./024-wing-gundam-zero.ts";

describe("Wing Gundam Zero (GD01-024)", () => {
  it("deals 3 damage to every friendly and enemy Lv.5-or-lower Unit on deploy", () => {
    const friendlyLow = createMockUnit({ level: 5, hp: 5 });
    const enemyLow = createMockUnit({ level: 4, hp: 5 });
    const enemyHigh = createMockUnit({ level: 6, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01WingGundamZero024],
        play: [friendlyLow],
        resourceArea: activeResources(8),
      },
      { play: [enemyLow, enemyHigh] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyLowId = p1.getCardsInZone("battleArea")[0]!;
    const [enemyLowId, enemyHighId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd01WingGundamZero024));

    expect(p1.getDamage(friendlyLowId)).toBe(3);
    expect(p2.getDamage(enemyLowId!)).toBe(3);
    expect(p2.getDamage(enemyHighId!)).toBe(0);
    expect(p1.getDamage(gd01WingGundamZero024)).toBe(0);
  });

  it("can attack on its deploy turn after pairing Heero Yuy and cannot be blocked", () => {
    const heero = createMockPilot({ name: "Heero Yuy", level: 1, cost: 1 });
    const blocker = createMockUnit({
      level: 6,
      hp: 10,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01WingGundamZero024, heero],
        resourceArea: activeResources(9),
      },
      { play: [blocker], shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd01WingGundamZero024));
    expectSuccess(p1.assignPilot(heero, gd01WingGundamZero024));
    expectSuccess(p1.enterBattle(gd01WingGundamZero024, "direct"));

    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
    expect(p2.isExhausted(blockerId)).toBe(false);
  });
});
