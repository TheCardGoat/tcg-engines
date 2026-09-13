import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { heraldOfProtectionRed } from "../actions/herald-of-protection.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { luminarisCelestialFury } from "./luminaris-celestial-fury.ts";

/**
 * Luminaris, Celestial Fury (DTD003) — Light Illusionist Weapon Scepter 2H.
 *
 * Printed Instant: {r}{r}: Target angel attack or attack action card with
 * Herald in its name gets go again. Once per turn.
 */

describe("Luminaris, Celestial Fury (DTD003) AAA", () => {
  it("happy: pay {r}{r} so a Herald attack action gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        weapon1: [luminarisCelestialFury],
        hand: [heraldOfProtectionRed, nimblismBlue, nimblismBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.playAttack(heraldOfProtectionRed);
    game.toReaction("attacker");
    Prism.activate(luminarisCelestialFury);
    game.passBoth();

    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: a non-Herald attack cannot be the target", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        weapon1: [luminarisCelestialFury],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.playAttack(snatchRed);
    Prism.expectActivationRejected(luminarisCelestialFury);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("boundary: once-per-turn rejects a second Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        weapon1: [luminarisCelestialFury],
        hand: [heraldOfProtectionRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.playAttack(heraldOfProtectionRed);
    game.toReaction("attacker");
    Prism.activate(luminarisCelestialFury);
    game.passBoth();
    Prism.expectActivationRejected(luminarisCelestialFury);
    expectFabPlayer(Prism).toHaveLife(32);
  });
});
