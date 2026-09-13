import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { millerSGrindstone } from "../weapons/miller-s-grindstone.ts";
import { disableYellow } from "./disable.ts";
import { nimblismBlue } from "./nimblism.ts";
import { theOldSwitcherooBlue } from "./the-old-switcheroo.ts";

/**
 * The Old Switcheroo (SUP087) — Reviled Action Attack, blue.
 *
 * Printed Instant: Discard this: the next time you would clash with target
 * hero this turn, instead you reveal the top of their deck and they reveal
 * the top of yours. If you win the clash, they discard a card.
 */

describe("The Old Switcheroo (SUP087) AAA", () => {
  it("happy: swapped clash reveals their 4{p} for you so you win and they discard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [millerSGrindstone],
        hand: [theOldSwitcherooBlue],
        resourcePoints: 3,
        actionPoints: 1,
        // Last entry is Bravo's own top (0{p}) — they reveal this under the swap.
        deck: [nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue],
        // Last entry is Dash's top (4{p}) — Bravo reveals this under the swap.
        deck: [nimblismBlue, disableYellow],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(theOldSwitcherooBlue);
    game.passBoth();
    expectFabCard(Bravo, theOldSwitcherooBlue).toBeIn("graveyard");

    Bravo.activate(millerSGrindstone);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectCombat(game).toHaveClashWinner(Bravo);
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: the Instant cannot be activated from the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        graveyard: [theOldSwitcherooBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).expectActivationRejected(theOldSwitcherooBlue);
  });

  it("timing: played as an attack it opens combat at printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [theOldSwitcherooBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).playAttack(theOldSwitcherooBlue);
    expectCombat(game).toHaveAttackPower(2);
  });
});
