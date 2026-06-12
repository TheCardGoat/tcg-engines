import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockCommand,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaGundamAerial070 } from "./070-gundam-aerial.ts";

describe("Gundam Aerial (GD01-070)", () => {
  it("deploys at cost 1 (base 3 − 2) when 4+ Commands are in the controller's trash", () => {
    const engine = GundamTestEngine.create({
      hand: [betaGundamAerial070],
      resourceArea: activeResources(5),
      trash: [createMockCommand(), createMockCommand(), createMockCommand(), createMockCommand()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(betaGundamAerial070));

    // Discounted cost 1 → 1 resource rested.
    const exhausted = p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id)).length;
    expect(exhausted).toBe(1);
  });

  it("does not reduce cost when fewer than 4 Commands are in trash", () => {
    const engine = GundamTestEngine.create({
      hand: [betaGundamAerial070],
      resourceArea: activeResources(5),
      trash: [createMockCommand(), createMockCommand(), createMockCommand()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(betaGundamAerial070));

    // Full printed cost 3 → 3 resources rested.
    const exhausted = p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id)).length;
    expect(exhausted).toBe(3);
  });
});
