import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { auroraEmissaryOfLightning } from "../heroes/aurora-emissary-of-lightning.ts";
import { dash } from "../heroes/dash.ts";
import { flitteringChargeRed } from "./flittering-charge.ts";
import { snatchRed } from "./snatch.ts";
import { electrynJoltstepRed } from "./electryn-joltstep.ts";

/**
 * Electryn Joltstep, Red (OMN080) — Lightning Runeblade Action, cost 1, 3{d}.
 * Printed: "Your next Runeblade or Lightning attack this turn gets +3{p}.
 * Create a Lightning Flow token. Go again"
 */

describe("Electryn Joltstep family AAA", () => {
  it("happy: the next Lightning attack gets +3{p} and a Lightning Flow is created", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        hand: [electrynJoltstepRed, flitteringChargeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraEmissaryOfLightning);

    Aurora.play(electrynJoltstepRed);
    game.helpers.resolveUntilIdle();
    Aurora.attackWith(flitteringChargeRed);

    // Flittering Charge base 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);
    expect(Aurora.zone("arena")).toContain("token:lightning-flow");
  });

  it("boundary: a Generic attack does not receive +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        hand: [electrynJoltstepRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraEmissaryOfLightning);

    Aurora.play(electrynJoltstepRed);
    game.helpers.resolveUntilIdle();
    Aurora.attackWith(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to play Electryn Joltstep", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        hand: [electrynJoltstepRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraEmissaryOfLightning);

    expectFabPlayer(Aurora).toHaveAP(1);
    Aurora.play(electrynJoltstepRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Aurora).toHaveAP(1);
  });
});
