import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { auroraEmissaryOfLightning } from "../heroes/aurora-emissary-of-lightning.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { riftBreakerRed } from "./rift-breaker.ts";

/**
 * Rift Breaker (OMN155) — Lightning Attack, 6{p}.
 * Printed: When this hits a hero, destroy a Lightning Flow token they control.
 */

describe("Rift Breaker (OMN155) AAA", () => {
  it("happy: a hit destroys their Lightning Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        hand: [riftBreakerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [fabToken("lightning-flow")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(auroraEmissaryOfLightning).playAttack(riftBreakerRed);
    game.closeCombat({ ordering: "listed", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveTokenCount("lightning-flow", 0);
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: a hit with no Lightning Flow still deals damage", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        hand: [riftBreakerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(auroraEmissaryOfLightning).playAttack(riftBreakerRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("lightning-flow", 0);
  });

  it("timing: a miss leaves their Lightning Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        hand: [riftBreakerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        arena: [fabToken("lightning-flow")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(auroraEmissaryOfLightning).playAttack(riftBreakerRed);
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveTokenCount("lightning-flow", 1);
  });
});
