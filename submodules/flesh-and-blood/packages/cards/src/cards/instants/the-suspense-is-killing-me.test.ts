import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { theSuspenseIsKillingMeBlue } from "./the-suspense-is-killing-me.ts";

/**
 * The Suspense is Killing Me (APS026) — Guardian Instant Aura (Suspense).
 *
 * Printed: Suspense
 *          Your first attack each turn gets +1{p}.
 *
 * CR 8.3.42 Suspense: enters the arena with 2 suspense counters, one is
 * removed at the start of the controller's turn, and the aura is destroyed
 * when none remain. CR 5.4.2/6.2.3: the +1{p} static generates a continuous
 * effect only while the aura is in the arena, and only for the controller's
 * FIRST attack each turn.
 */

describe("The Suspense is Killing Me (APS026) AAA", () => {
  it("happy: while in the arena, the first attack this turn gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [theSuspenseIsKillingMeBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(theSuspenseIsKillingMeBlue);
    game.passBoth();
    expectFabCard(Bravo, theSuspenseIsKillingMeBlue).toBeIn("arena");
    expectFabCard(Bravo, theSuspenseIsKillingMeBlue).toHaveCounters(2, "suspense");

    // Snatch (4{p}) as the first attack of the turn: 4 + 1 = 5.
    Bravo.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a second attack the same turn does not get +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [theSuspenseIsKillingMeBlue, snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(theSuspenseIsKillingMeBlue);
    game.passBoth();

    const attacks = Bravo.cardsIn("hand", snatchRed);
    Bravo.attackWith(attacks[0]!);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();

    // The aura's grant is first-attack-only: the second Snatch stays at 4{p}.
    Bravo.attackWith(attacks[1]!);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: once the suspense counters run out, a later attack gets no bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [theSuspenseIsKillingMeBlue],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    expectFabCard(Bravo, theSuspenseIsKillingMeBlue).toHaveCounters(2, "suspense");

    // Two full turn cycles tick the two suspense counters away.
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, theSuspenseIsKillingMeBlue).toBeIn("graveyard");
    Bravo.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
