import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, expectSuccess, activeResources } from "@tcg/gundam-engine";
import { betaWingGundamBirdMode002 } from "./002-wing-gundam-bird-mode.ts";

describe("Wing Gundam (Bird Mode) (ST02-002)", () => {
  it("【Deploy】 keeps the Unit in battle and places a separate active EX Resource", () => {
    const engine = GundamTestEngine.create({
      hand: [betaWingGundamBirdMode002],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const resourcesBefore = p1.getCardsInZone("resourceArea").length;

    expectSuccess(p1.deployUnit(betaWingGundamBirdMode002));

    const resources = p1.getCardsInZone("resourceArea");
    expect(resources).toHaveLength(resourcesBefore + 1);
    expect(p1.isExhausted(resources.at(-1)!)).toBe(false);
    expect(p1.getCardZone(betaWingGundamBirdMode002)).toBe(`battleArea:${PLAYER_ONE}`);
  });
});
