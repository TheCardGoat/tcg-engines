import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { mangleRed } from "../actions/mangle.ts";
import { weaveEarthBlue } from "../actions/weave-earth.ts";
import { winterSGraspBlue } from "../actions/winter-s-grasp.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { gauntletsOfTheBorealDomain } from "./gauntlets-of-the-boreal-domain.ts";

describe("Gauntlets of the Boreal Domain (AJV006) AAA", () => {
  it("happy: pitching Earth this way gives Mangle +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletsOfTheBorealDomain],
        hand: [mangleRed, weaveEarthBlue, nimblismBlue],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(gauntletsOfTheBorealDomain);
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargets: "minimum",
      paymentCanonicalId: weaveEarthBlue.canonicalId,
    });
    Bravo.play(mangleRed, { pitch: [nimblismBlue] });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(30);
  });

  it("boundary: prepaid {r} with no Earth/Ice pitch leaves Mangle at 8", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletsOfTheBorealDomain],
        hand: [mangleRed, nimblismBlue, nimblismBlue],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(gauntletsOfTheBorealDomain);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    Bravo.play(mangleRed, { pitch: [nimblismBlue, nimblismBlue] });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(32);
  });

  it("timing: pitching Ice this way gives Mangle dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletsOfTheBorealDomain],
        hand: [mangleRed, winterSGraspBlue, nimblismBlue],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [snatchRed, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(gauntletsOfTheBorealDomain);
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargets: "minimum",
      paymentCanonicalId: winterSGraspBlue.canonicalId,
    });
    Bravo.play(mangleRed, { pitch: [nimblismBlue] });
    game.passBoth();
    game.passBoth();
    game.advanceCombatTo("reaction");

    expectCombat(game).toHaveKeyword("dominate");
    expectFabCard(Bravo, gauntletsOfTheBorealDomain).toBeIn("arms");
  });
});
