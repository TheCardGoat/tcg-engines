import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { lightningFlow } from "../tokens/lightning-flow.ts";
import { auroraEmissaryOfLightning } from "./aurora-emissary-of-lightning.ts";

/**
 * Aurora, Emissary of Lightning (OMN048) — Lightning Runeblade Young.
 *
 * Printed: Instant - {r}{r}, {t}, destroy a Lightning Flow you control:
 * Create an Embodiment of Lightning token.
 */

describe("Aurora Emissary of Lightning (OMN048) AAA", () => {
  it("happy: paying {r}{r}, tapping, and destroying Lightning Flow creates Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        arena: [lightningFlow],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraEmissaryOfLightning);

    Aurora.activate(auroraEmissaryOfLightning);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Aurora.zone("arena")).not.toContain(lightningFlow.canonicalId);
    expectFabPlayer(Aurora).toHaveTokenCount("embodiment-of-lightning", 1).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("embodiment-of-lightning", 0);
  });

  it("boundary: cannot activate without a Lightning Flow to destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        arena: [],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraEmissaryOfLightning);

    Aurora.expectActivationRejected(auroraEmissaryOfLightning);
    expectFabPlayer(Aurora).toHaveTokenCount("embodiment-of-lightning", 0);
  });

  it("boundary: 1 resource cannot pay the Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        arena: [lightningFlow],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraEmissaryOfLightning);

    Aurora.expectActivationRejected(auroraEmissaryOfLightning);
    expectFabCard(Aurora, lightningFlow).toBeIn("arena");
    expectFabPlayer(Aurora).toHaveTokenCount("embodiment-of-lightning", 0);
  });
});
