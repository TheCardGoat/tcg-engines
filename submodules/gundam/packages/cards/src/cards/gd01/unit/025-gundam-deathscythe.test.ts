import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GundamDeathscythe025 } from "./025-gundam-deathscythe.ts";

describe("Gundam Deathscythe (GD01-025)", () => {
  it("data grants self First Strike after placing a rested Resource", () => {
    expect(gd01GundamDeathscythe025.effects?.[0]?.directives[1]).toEqual({
      action: {
        action: "grantKeyword",
        keyword: "FirstStrike",
        duration: "thisTurn",
        target: { owner: "self", cardType: "unit" },
      },
    });
  });

  it("places 1 rested Resource when paired with an Operation Meteor Pilot", () => {
    const duo = createMockPilot({ name: "Duo Maxwell", traits: ["operation meteor"], cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [duo],
      play: [gd01GundamDeathscythe025],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const resourcesBefore = p1.getCardsInZone("resourceArea").length;

    expectSuccess(p1.assignPilot(duo, gd01GundamDeathscythe025));

    expect(p1.getCardsInZone("resourceArea").length).toBe(resourcesBefore + 1);
  });
});
