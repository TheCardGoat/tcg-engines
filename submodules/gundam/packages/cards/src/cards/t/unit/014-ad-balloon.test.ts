import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectFailure,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { tAdBalloon014 } from "./014-ad-balloon.ts";

describe("Ad Balloon (T-014)", () => {
  it("declares static unit restrictions", () => {
    expect(tAdBalloon014.effects?.[0]?.directives[0]).toMatchObject({
      action: {
        action: "restrictUnit",
        restrictions: ["cannotSetActive", "cannotPairPilot"],
      },
    });
  });

  it("cannot be paired with a Pilot", () => {
    const pilot = createMockPilot({ cost: 1, level: 1 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [tAdBalloon014],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const adBalloonId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.assignPilot(pilot, adBalloonId), "UNIT_CANNOT_PAIR_PILOT");
  });

  it("reports that it cannot be set active", () => {
    const engine = GundamTestEngine.create({ play: [tAdBalloon014] });
    const adBalloonId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(
      getEffectiveStats(adBalloonId, engine.getG(), framework.cards, framework).restrictions,
    ).toContain("cannot-set-active");
  });
});
