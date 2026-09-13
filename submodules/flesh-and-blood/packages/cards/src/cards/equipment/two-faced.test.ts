import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { coldSnapBlue } from "../actions/cold-snap.ts";
import { twoFaced } from "./two-faced.ts";

/**
 * Two-Faced (FAB414) — Reviled Equipment - Head, d1.
 *
 * Printed: When this defends, the attacking hero draws a card, then look at
 * their hand and choose a card. They discard the chosen card. Blade Break.
 */

describe("Two-Faced (FAB414) AAA", () => {
  it("happy: the attacking hero draws, then discards the card you choose", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, nimblismBlue],
        deckTop: [coldSnapBlue],
        deck: 6,
        actionPoints: 1,
      },
      {
        hero: dash,
        head: [twoFaced],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    Dash.defendWith(twoFaced);

    // The attacking hero draws first, then you look at their hand and pick.
    game.advanceToDecision(Dash, "entity-target");
    Dash.target(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    // Bravo's hand: Cold Snap (the forced draw) plus a filler (Snatch's own
    // "When this hits, draw a card"), with Nimblism discarded.
    expectFabPlayer(Bravo).toHaveHandCount(2);
    expectFabCard(Bravo, coldSnapBlue).toBeIn("hand");
    expectFabCard(Bravo, nimblismBlue).toBeIn("graveyard");
    // 4{p} attack on the 1{d} head: 3 damage carries.
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: with no defense declared, the attacking hero neither draws nor discards for Two-Faced", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, nimblismBlue],
        deck: 6,
        actionPoints: 1,
      },
      {
        hero: dash,
        head: [twoFaced],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();

    // Snatch left the hand; the only refill is Snatch's own on-hit draw, and
    // nothing was discarded from it.
    expectFabPlayer(Bravo).toHaveHandCount(2);
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
    expect(Bravo.zone("graveyard")).toEqual([snatchRed.canonicalId]);
    // 4{p} attack unblocked.
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
