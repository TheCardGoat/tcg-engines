import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";
import { goldenGrail } from "../weapons/golden-grail.ts";
import { nimblismBlue } from "./nimblism.ts";
import { shatterTheWeakpointRed } from "./shatter-the-weakpoint.ts";

/**
 * Shatter the Weakpoint, Red (MPW068) — Warrior Action, cost 1, go again.
 *
 * Printed: "Your next sword attack this turn gets +4{p} and "When this hits a
 * Warrior hero, destroy an equipment they control with 0{d}."\nGo again"
 */

describe("Shatter the Weakpoint (MPW068) AAA", () => {
  it("happy: a sword hit on a Warrior hero destroys their 0{d} equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [shatterTheWeakpointRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: halaBladesaintOfTheVow,
        head: [nullruneHood],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Hala = game.as(halaBladesaintOfTheVow);

    Bravo.play(shatterTheWeakpointRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);

    expectCombat(game).toHaveAttackPower(7);
    Hala.defendWith();
    game.closeCombat();

    expectFabPlayer(Hala).toHaveLife(13);
    expectFabCard(Hala, nullruneHood).toBeIn("graveyard");
  });

  it("boundary: a hit on a non-Warrior hero spares the 0{d} equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [shatterTheWeakpointRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        head: [nullruneHood],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(shatterTheWeakpointRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);

    expectCombat(game).toHaveAttackPower(7);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabCard(Dash, nullruneHood).toBeIn("head");
  });

  it("timing: a fully blocked sword attack leaves the 0{d} equipment standing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [shatterTheWeakpointRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: halaBladesaintOfTheVow,
        head: [nullruneHood],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Hala = game.as(halaBladesaintOfTheVow);

    Bravo.play(shatterTheWeakpointRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);
    Hala.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Hala).toHaveLife(20);
    expectFabCard(Hala, nullruneHood).toBeIn("head");
  });
});
