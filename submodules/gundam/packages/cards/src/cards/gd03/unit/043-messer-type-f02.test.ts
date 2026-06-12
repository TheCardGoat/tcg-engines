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
import { gd03MesserTypeF02043 } from "./043-messer-type-f02.ts";

describe("Messer Type-F02 (GD03-043)", () => {
  it("【When Paired】 deals 1 damage to an enemy Unit", () => {
    const pilot = createMockPilot({ traits: ["mafty"] });
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03MesserTypeF02043],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(getDamageCounter(engine, enemyId)).toBe(1);
  });
});
