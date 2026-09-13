import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { twoStepsForward } from "./two-steps-forward.ts";

/**
 * Two Steps Forward (PEN033) — Ninja Legs d1 Battleworn.
 *
 * Printed: Instant - Destroy this: Create an Agility token. Activate this
 * only if you've hit 2 or more times this combat chain.
 */

describe("Two Steps Forward (PEN033) AAA", () => {
  it("happy: after two hits this chain, destroy this to create Agility", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        legs: [twoStepsForward],
        hand: [headJabRed, headJabRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(headJabRed);
    game.closeCombat({ optionals: "decline" });
    Katsu.playAttack(headJabRed);
    game.closeCombat({ optionals: "decline" });

    Katsu.activate(twoStepsForward);
    game.passBoth();

    expectFabCard(Katsu, twoStepsForward).toBeIn("graveyard");
    expectFabPlayer(Katsu).toHaveTokenCount("agility", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("agility", 0);
  });

  it("boundary: cannot activate without two hits this combat chain", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        legs: [twoStepsForward],
        hand: [headJabRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(headJabRed);
    game.advanceCombatTo("reaction");
    Katsu.expectActivationRejected(twoStepsForward);
    expectFabCard(Katsu, twoStepsForward).toBeIn("legs");
    expectFabPlayer(Katsu).toHaveTokenCount("agility", 0);
  });

  it("timing: Instant is illegal with no open combat chain", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        legs: [twoStepsForward],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.expectActivationRejected(twoStepsForward);
    expectFabCard(Katsu, twoStepsForward).toBeIn("legs");
  });
});
