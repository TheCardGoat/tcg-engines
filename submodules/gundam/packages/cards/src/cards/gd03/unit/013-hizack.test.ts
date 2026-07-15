import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Hizack013 } from "./013-hizack.ts";

describe("Hizack (GD03-013)", () => {
  it("gets AP+1 and Repair while another Jupitris Unit is in play", () => {
    const ally = createMockUnit({ traits: ["jupitris"] });
    const engine = GundamTestEngine.create({
      play: [{ card: gd03Hizack013, damage: 1 }, ally],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({
      effectiveAp: 3,
      keywords: expect.arrayContaining(["Repair"]),
    });
    expectSuccess(p1.passPhase());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
    expectSuccess(p1.passActionStep());
    expect(p1.getDamage(unitId)).toBe(0);
  });

  it("stays at printed AP without another Jupitris Unit", () => {
    const ally = createMockUnit({ traits: ["titans"] });
    const engine = GundamTestEngine.create({
      play: [{ card: gd03Hizack013, damage: 1 }, ally],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const visibleHizack = p1.getVisibleCard(unitId);
    expect(visibleHizack?.effectiveAp).toBe(2);
    expect(visibleHizack?.keywords).not.toContain("Repair");
    expectSuccess(p1.passPhase());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
    expectSuccess(p1.passActionStep());
    expect(p1.getDamage(unitId)).toBe(1);
  });
});
