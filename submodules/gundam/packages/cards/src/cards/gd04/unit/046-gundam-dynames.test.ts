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
import { gd04GundamDynames046 } from "./046-gundam-dynames.ts";

describe("Gundam Dynames (GD04-046)", () => {
  it("【Deploy】 rests this Unit and deals 2 damage to a chosen enemy Unit (Lv.3 or lower)", () => {
    const lowLv = createMockUnit({ ap: 1, hp: 5, level: 2 });
    const highLv = createMockUnit({ ap: 1, hp: 5, level: 5 });

    const engine = GundamTestEngine.create(
      {
        hand: [gd04GundamDynames046],
        resourceArea: activeResources(5),
      },
      { play: [lowLv, highLv] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [lowLvId, highLvId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd04GundamDynames046, { targets: [lowLvId!] }));
    while (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
    }

    const dynamesId = p1.getCardsInZone("battleArea")[0]!;
    expect(engine.getG().exhausted[dynamesId]).toBe(true);
    expect(getDamageCounter(engine, lowLvId!)).toBe(2);
    // Lv.5 unit isn't a candidate (filter Lv ≤ 3) so it takes no damage.
    expect(getDamageCounter(engine, highLvId!)).toBe(0);
  });
});
