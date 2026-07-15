import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectFailure,
} from "../../../index.ts";

describe("deployUnit target validation", () => {
  it("rejects an unrelated target and leaves the visible board unchanged", () => {
    const unit = createMockUnit({ level: 0, cost: 0 });
    const enemy = createMockUnit();
    const engine = GundamTestEngine.create({ hand: [unit] }, { play: [enemy] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.deployUnit(unit, { targets: [enemyId] }), "INVALID_TARGET");

    expect(p1.getCardZone(unit)).toBe(`hand:${PLAYER_ONE}`);
    expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
