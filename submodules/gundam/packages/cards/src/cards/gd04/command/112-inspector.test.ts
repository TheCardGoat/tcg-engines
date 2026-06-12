import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd04Inspector112 } from "./112-inspector.ts";

describe("Inspector (GD04-112)", () => {
  it("【Main】deals 1 damage to all Units that are Lv.2 or lower", () => {
    const friendlyLow = createMockUnit({ level: 2, hp: 4 });
    const enemyLow = createMockUnit({ level: 1, hp: 4 });
    const enemyHigh = createMockUnit({ level: 3, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04Inspector112],
        play: [friendlyLow],
        resourceArea: activeResources(4),
      },
      { play: [enemyLow, enemyHigh] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyLowId = p1.getCardsInZone("battleArea")[0]!;
    const [enemyLowId, enemyHighId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd04Inspector112));

    expect(getDamageCounter(engine, friendlyLowId)).toBe(1);
    expect(getDamageCounter(engine, enemyLowId!)).toBe(1);
    expect(getDamageCounter(engine, enemyHighId!)).toBe(0);
  });
});
