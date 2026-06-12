import { describe, it, expect } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd04GundamThroneEins036 } from "./036-gundam-throne-eins.ts";

describe("Gundam Throne Eins (GD04-036)", () => {
  it("【Deploy】rests up to 2 other active CB Units and deals that much damage to enemy Lv.6-or-lower Units", () => {
    const cbOne = createMockUnit({ traits: ["cb"], hp: 4 });
    const cbTwo = createMockUnit({ traits: ["cb"], hp: 4 });
    const lowEnemy = createMockUnit({ level: 6, hp: 5 });
    const highEnemy = createMockUnit({ level: 7, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04GundamThroneEins036],
        play: [cbOne, cbTwo],
        resourceArea: activeResources(6),
      },
      { play: [lowEnemy, highEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [cbOneId, cbTwoId] = p1.getCardsInZone("battleArea");
    const [lowEnemyId, highEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd04GundamThroneEins036, { targets: [cbOneId!, cbTwoId!] }));

    expect(engine.getG().exhausted[cbOneId!]).toBe(true);
    expect(engine.getG().exhausted[cbTwoId!]).toBe(true);
    expect(getDamageCounter(engine, lowEnemyId!)).toBe(2);
    expect(getDamageCounter(engine, highEnemyId!)).toBe(0);
  });
});
