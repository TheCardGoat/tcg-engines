import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { sinkBelowBlue } from "../defense-reactions/sink-below.ts";
import { goldenGrail } from "../weapons/golden-grail.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { termsOfCombatRed } from "./terms-of-combat.ts";

/**
 * Terms of Combat, Red (MPW034) — Warrior Action, cost 2, go again.
 *
 * Printed: "Your next weapon attack this turn gets +4{p} and "Whenever a
 * defense reaction is played or activated this chain link, draw a card."\nGo
 * again"
 */

describe("Terms of Combat (MPW034) AAA", () => {
  it("happy: the armed weapon attack gets +4{p} and each DR played on its link draws", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [termsOfCombatRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [sinkBelowBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(termsOfCombatRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);

    expectCombat(game).toHaveAttackPower(7);
    game.toReaction("defender");
    Dash.play(sinkBelowBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // The DR play on the armed chain link drew Bravo a card.
    expectFabPlayer(Bravo).toHaveHandCount(1);

    game.helpers.resolveRestOfCombat();
    // 7{p} − 2{d}
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: the +4{p} arms the next weapon attack, not an attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [termsOfCombatRed, snatchRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(termsOfCombatRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);

    // Snatch is no weapon: the latch survives unconsumed at its printed +0.
    expectCombat(game).toHaveAttackPower(4);
    Dash.defendWith();
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: no defense reaction on the link draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [termsOfCombatRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(termsOfCombatRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);
    expectCombat(game).toHaveAttackPower(7);
    // Dash blocks from hand instead of playing a defense reaction.
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveHandCount(0);
    // 7{p} − 2{d}
    expectFabPlayer(Dash).toHaveLife(15);
  });
});
