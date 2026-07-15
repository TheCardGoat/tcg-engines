import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaJegan016 } from "./016-jegan.ts";

describe("Jegan (GD01-016)", () => {
  it("deploys at cost 1 (base 2 − 1) when 2+ (Earth Federation) Units are in play", () => {
    const ef1 = createMockUnit({ ap: 1, hp: 1, traits: ["earth federation"] });
    const ef2 = createMockUnit({ ap: 1, hp: 1, traits: ["earth federation"] });
    // Jegan requires Lv.3 resources; provide 3 active resources so only the
    // cost discount (not resource-level gating) distinguishes the two cases.
    const engine = GundamTestEngine.create({
      hand: [betaJegan016],
      play: [ef1, ef2],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const activeBefore = p1.getCardsInZone("resourceArea").length;

    expectSuccess(p1.deployUnit(betaJegan016));

    // Discounted cost = 1 → 1 resource rested (2 still active).
    const exhaustedAfter = p1
      .getCardsInZone("resourceArea")
      .filter((id) => p1.isExhausted(id)).length;
    expect(activeBefore).toBe(3);
    expect(exhaustedAfter).toBe(1);
  });

  it("does not reduce cost when fewer than 2 (Earth Federation) Units are in play", () => {
    const ef1 = createMockUnit({ ap: 1, hp: 1, traits: ["earth federation"] });
    const engine = GundamTestEngine.create({
      hand: [betaJegan016],
      play: [ef1],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(betaJegan016));

    // Full printed cost 2 → 2 resources rested.
    const exhaustedAfter = p1
      .getCardsInZone("resourceArea")
      .filter((id) => p1.isExhausted(id)).length;
    expect(exhaustedAfter).toBe(2);
  });
});
