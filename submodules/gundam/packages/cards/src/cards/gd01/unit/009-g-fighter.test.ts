import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  createMockUnit,
  hasKeywordGrant,
} from "@tcg/gundam-engine";
import { gd01GFighter009 } from "./009-g-fighter.ts";

describe("G-Fighter (GD01-009)", () => {
  it("【Deploy】 grants <High-Maneuver> to a chosen (White Base Team) Unit", () => {
    const wbtUnit = createMockUnit({
      ap: 2,
      hp: 3,
      traits: ["earth federation", "white base team"],
    });
    const engine = GundamTestEngine.create({
      hand: [gd01GFighter009],
      resourceArea: activeResources(3),
      play: [wbtUnit],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [wbtId] = p1.getCardsInZone("battleArea");

    expect(hasKeywordGrant(engine, wbtId!, "HighManeuver")).toBe(false);

    expectSuccess(p1.deployUnit(gd01GFighter009, { targets: [wbtId!] }));

    expect(hasKeywordGrant(engine, wbtId!, "HighManeuver")).toBe(true);
  });
});
