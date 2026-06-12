import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  createMockPilot,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd01Lagowe050 } from "./050-lagowe.ts";

describe("LaGOWE (GD01-050)", () => {
  it("【Attack】If this Unit has 5 or more AP and it is attacking an enemy Unit, choose 1 enemy Unit. Deal 2 damage to it.", () => {
    // LaGOWE base AP is 2; pair a pilot with +3 AP bonus → effective 5 AP.
    const pilot = createMockPilot({
      name: "Big Bonus Pilot",
      apBonus: 3,
      hpBonus: 0,
      level: 1,
      cost: 1,
    });
    const defender = createMockUnit({ ap: 1, hp: 6 });

    const engine = GundamTestEngine.create(
      {
        hand: [gd01Lagowe050, pilot],
        resourceArea: activeResources(6),
        deck: 5,
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01Lagowe050));
    expectSuccess(p1.assignPilot(pilot, gd01Lagowe050));

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(gd01Lagowe050, defenderId));

    // Attack trigger condition met (AP >= 5, attacking a unit) → 2 damage dealt.
    expect(getDamageCounter(engine, defenderId)).toBe(2);
  });

  it("【Attack】does NOT deal damage when AP < 5", () => {
    // LaGOWE at base 2 AP, no pilot bonus → condition fails, no damage.
    const defender = createMockUnit({ ap: 1, hp: 6 });

    const engine = GundamTestEngine.create(
      {
        play: [gd01Lagowe050],
        deck: 5,
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(gd01Lagowe050, defenderId));

    // Attack trigger condition NOT met (AP = 2 < 5) → no damage.
    expect(getDamageCounter(engine, defenderId)).toBe(0);
  });
});
