import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { breakStatureYellow } from "./break-stature.ts";

/**
 * Break Stature Yellow (MPG014) — Guardian AAC, 8{p}.
 *
 * Printed: Crush — When this deals 4 or more damage to a hero, destroy an
 * aura token they control. They can't create auras with that token's name
 * until the end of their next turn.
 */

describe("Break Stature (MPG014) AAA", () => {
  it("happy: crush destroys an aura token they control", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [breakStatureYellow], resourcePoints: 5, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [fabToken("might")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(breakStatureYellow);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(12);
    expectFabPlayer(Dash).toHaveTokenCount("might", 0);
  });

  it("boundary: fully blocked, the aura token survives", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [breakStatureYellow], resourcePoints: 5, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [fabToken("might")],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(breakStatureYellow);
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Dash).toHaveTokenCount("might", 1);
  });

  it("timing: crush with no aura token still deals 8 and does not hang", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [breakStatureYellow], resourcePoints: 5, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(breakStatureYellow);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(12);
  });
});
