import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO, expectSuccess } from "@tcg/gundam-engine";
import { gd03GundamBarbatos6thForm061 } from "./061-gundam-barbatos-6th-form.ts";

describe("Gundam Barbatos 6th Form (GD03-061)", () => {
  it("repairs 3 damage at end of turn while it has exactly 1 remaining HP", () => {
    const engine = GundamTestEngine.create({
      play: [{ card: gd03GundamBarbatos6thForm061, damage: 3 }],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(unitId)).toBe(0);
  });

  it("does not repair above 1 remaining HP", () => {
    const engine = GundamTestEngine.create({
      play: [{ card: gd03GundamBarbatos6thForm061, damage: 2 }],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(unitId)).toBe(2);
  });
});
