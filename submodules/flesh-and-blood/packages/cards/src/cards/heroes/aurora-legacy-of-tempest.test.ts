import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { auroraLegacyOfTempest } from "./aurora-legacy-of-tempest.ts";

/**
 * Aurora, Legacy of Tempest (OMN047) — Lightning Runeblade Hero.
 *
 * Printed: Instant - {r}{r}, {t}, destroy a Lightning Flow you control:
 * Create an Embodiment of Lightning token.
 */

describe("Aurora, Legacy of Tempest (OMN047) AAA", () => {
  it("happy: paying {r}{r}, tapping, and destroying a Lightning Flow creates Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraLegacyOfTempest,
        arena: [fabToken("lightning-flow")],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraLegacyOfTempest);

    Aurora.activate(auroraLegacyOfTempest);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabToken(game, "lightning-flow").toHaveCount(0);
    expectFabPlayer(Aurora).toHaveTokenCount("embodiment-of-lightning", 1);
    expectFabCard(Aurora, auroraLegacyOfTempest).toBeTapped();
    expectFabPlayer(game.as(dash)).toHaveTokenCount("embodiment-of-lightning", 0);
  });

  it("boundary: cannot activate without a Lightning Flow to destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraLegacyOfTempest,
        arena: [],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraLegacyOfTempest);

    Aurora.expectActivationRejected(auroraLegacyOfTempest);
    expectFabPlayer(Aurora).toHaveTokenCount("embodiment-of-lightning", 0);
  });

  it("boundary: 1 resource cannot pay the Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraLegacyOfTempest,
        arena: [fabToken("lightning-flow")],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraLegacyOfTempest);

    Aurora.expectActivationRejected(auroraLegacyOfTempest);
    expectFabPlayer(Aurora).toHaveTokenCount("embodiment-of-lightning", 0);
  });
});
