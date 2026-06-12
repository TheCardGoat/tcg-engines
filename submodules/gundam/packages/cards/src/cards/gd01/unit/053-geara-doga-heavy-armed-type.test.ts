import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GearaDogaHeavyArmedType053 } from "./053-geara-doga-heavy-armed-type.ts";

describe("Geara Doga (Heavy Armed Type) (GD01-053)", () => {
  it("【Activate·Main】①：deals 1 damage only to the chosen low-AP enemy Unit", () => {
    // Two enemies with AP <= 2 — the chosen one gets damaged, the other is untouched.
    const enemy1 = createMockUnit({ ap: 1, hp: 3 });
    const enemy2 = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        play: [gd01GearaDogaHeavyArmedType053],
        resourceArea: activeResources(3),
      },
      { play: [enemy1, enemy2] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemy1Id, enemy2Id] = p2.getCardsInZone("battleArea");
    if (!enemy1Id || !enemy2Id) throw new Error("setup failed");

    expectSuccess(p1.activateAbility(gd01GearaDogaHeavyArmedType053, 0, { targets: [enemy1Id] }));

    // Damage lands only on chosen target.
    expect(engine.getG().damage[enemy1Id] ?? 0).toBe(1);
    expect(engine.getG().damage[enemy2Id] ?? 0).toBe(0);
  });
});
