import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectFailure,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { tWireGuidedArm022 } from "./022-wire-guided-arm.ts";

describe("Wire-Guided Arm (T-022)", () => {
  it("declares that it cannot be paired with a Pilot", () => {
    expect(tWireGuidedArm022.effects?.[0]?.directives[0]).toMatchObject({
      action: {
        action: "restrictUnit",
        restrictions: ["cannotPairPilot"],
      },
    });
  });

  it("cannot be paired with a Pilot", () => {
    const pilot = createMockPilot({ cost: 1, level: 1 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [tWireGuidedArm022],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const wireGuidedArmId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.assignPilot(pilot, wireGuidedArmId), "UNIT_CANNOT_PAIR_PILOT");
  });

  it("reports the cannot-pair restriction in effective stats", () => {
    const engine = GundamTestEngine.create({ play: [tWireGuidedArm022] });
    const wireGuidedArmId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(
      getEffectiveStats(wireGuidedArmId, engine.getG(), framework.cards, framework).restrictions,
    ).toContain("cannot-pair-pilot");
  });
});
