import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { pintOfStrongAndStoutBlue } from "./pint-of-strong-and-stout.ts";

/**
 * Pint of Strong and Stout (Blue) (BET026) — Guardian Action, cost 0, go again.
 *
 * Printed: "Create a Might and a Vigor token.\nGo again"
 *
 * fab-rules Mode B handoff:
 *   citations: CR 2.10 (token creation creates the named token objects under
 *     the controller), CR 8.3.4a (go again refunds the spent action point).
 *   MODULE DEFECT RESOLVED (plan §5, W3-FIX3 2026-08-18): the module authored
 *     ONE create-token leaf with the compound slug "might-and-a-vigor", which
 *     matches no token definition (Might is TCC105, Vigor is TCC107 — two
 *     separate tokens). Re-shaped into a sequence of two create-token leaves
 *     with slugs "might" and "vigor" (authoring shape: LGS355).
 *   testImplications:
 *     - One play seats exactly one Might and one Vigor token in the arena.
 *     - The cost-0 play with go again refunds the spent action point.
 *     - A second play in the same turn stacks a second pair (each play mints
 *       its own tokens; nothing is deduplicated).
 */

describe("Pint of Strong and Stout (Blue) (BET026) AAA", () => {
  it("happy: the play creates exactly one Might and one Vigor token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [pintOfStrongAndStoutBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(pintOfStrongAndStoutBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 1);
    expectFabCard(Bravo, pintOfStrongAndStoutBlue).toBeIn("graveyard");
  });

  it("boundary: cost-0 play is legal at zero resources and go again refunds the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [pintOfStrongAndStoutBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(pintOfStrongAndStoutBlue);
    game.helpers.resolveUntilIdle();

    // No resource points were needed and the spent action point came back
    // (CR 8.3.4a), so the Guardian can keep acting this turn.
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("timing: a second play in the same turn stacks a second pair", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [pintOfStrongAndStoutBlue, pintOfStrongAndStoutBlue],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(pintOfStrongAndStoutBlue);
    game.helpers.resolveUntilIdle();
    Bravo.play(pintOfStrongAndStoutBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("might", 2);
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 2);
  });
});
