import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd02Gabthley008 } from "./008-gabthley.ts";

describe("Gabthley (GD02-008)", () => {
  it("【When Linked】Choose 1 rested enemy Unit. Deal 1 damage to it.", () => {
    const pilot = createMockPilot({
      name: "Jerid Messa",
      traits: ["titans"],
      level: 2,
      cost: 1,
    });
    const enemy = createMockUnit({ ap: 2, hp: 4, level: 2 });

    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd02Gabthley008],
        resourceArea: activeResources(5),
        deck: 5,
      },
      { play: [enemy] },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2Cards = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
    const enemyId = p2Cards[0]!;

    // Rest the enemy so it qualifies as a target for the whenLinked effect.
    engine.getG().exhausted[enemyId] = true;

    expectSuccess(p1.assignPilot(pilot, gd02Gabthley008));

    // The whenLinked trigger fired and was auto-resolved (single valid
    // target). It dealt 1 damage to the rested enemy unit.
    expect(getDamageCounter(engine, enemyId)).toBe(1);
  });
});
