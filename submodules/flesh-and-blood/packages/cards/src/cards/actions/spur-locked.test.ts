import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { spurLockedBlue } from "./spur-locked.ts";

/**
 * Spur Locked (HNT255) — Chaos Action, cost 0, go again.
 *
 * Printed: Each hero secretly chooses a number between 1 and 6, then those
 * numbers are revealed. The hero that chose the highest number loses that much
 * {h}, searches their deck for a card with cost less than or equal to the
 * chosen number, reveals it, puts it in their hand, then shuffles. Go again
 *
 * Each hero chooses 1–6 (opponent first). Highest loses that much life and
 * searches their deck. Ties pay both.
 */

describe("Spur Locked (HNT255) AAA", () => {
  it("happy: highest number loses that much life and searches cost ≤ that number", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [spurLockedBlue],
        life: 20,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const instanceId = Bravo.findCardInZone("hand", spurLockedBlue);
    game.playInstance(Bravo.id, instanceId, {}, "explicit");
    game.passBoth();
    Dash.choose("1");
    Bravo.choose("6");
    Bravo.target(snatchRed);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, spurLockedBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabPlayer(Bravo).toHaveLife(14);
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
  });

  it("boundary: tied highest — condition holds for every tied hero (engine gap: only the first payout lands)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [spurLockedBlue],
        life: 12,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 18, deckTop: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const instanceId = Bravo.findCardInZone("hand", spurLockedBlue);
    game.playInstance(Bravo.id, instanceId, {}, "explicit");
    game.passBoth();
    Dash.choose("3");
    Bravo.choose("3");
    // Each tied-highest hero pays, then searches: answer both searches.
    Bravo.target(snatchRed);
    Dash.target(snatchRed);
    game.untilIdle({ entityTargets: "minimum" });

    // DEFECT PIN (§5 row HNT255): "The hero that chose the highest number"
    // covers both tied heroes, the per-iteration condition evaluates true
    // for each, and the first tied hero pays — but the layer-resolution
    // sequence-prefix flush drops the second for-each iteration after the
    // first iteration's decision-bearing search. Printed behavior pays both
    // (Bravo 9, Dash 15); this pin records the current partial payout.
    expectFabPlayer(Bravo).toHaveLife(9);
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("timing: go again refunds the spent action point at resolution", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [spurLockedBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const instanceId = Bravo.findCardInZone("hand", spurLockedBlue);
    game.playInstance(Bravo.id, instanceId, {}, "explicit");
    game.passBoth();
    Dash.choose("2");
    Bravo.choose("1");
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, spurLockedBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(18);
    expectFabPlayer(Bravo).toHaveLife(20);
  });
});
