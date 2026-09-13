import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { rushingRiverRed } from "./rushing-river.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { breakTideYellow } from "./break-tide.ts";

/**
 * Break Tide (EVR038) — Ninja Action - Attack, cost 0, 2{p}, 3{d}.
 *
 * Printed: Combo - If Rushing River or Flood of Force was the last attack
 * this combat chain, Break Tide gains +3{p}, dominate, and "If Break Tide
 * hits, banish the top card of your deck. Until the end of your next turn,
 * you may play it."
 */

describe("Break Tide (EVR038) AAA", () => {
  it("happy: after Rushing River on the same chain this gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [rushingRiverRed, breakTideYellow],
        actionPoints: 2,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(rushingRiverRed);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(breakTideYellow);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("timing: a combo hit banishes the top of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [rushingRiverRed, breakTideYellow],
        actionPoints: 2,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(rushingRiverRed);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(breakTideYellow);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Bravo, nimblismBlue).toBeBanished();
  });

  it("boundary: Snatch as the last attack does not grant +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, breakTideYellow],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(snatchRed);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(breakTideYellow);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(2);
    expectCombat(game).notToHaveKeyword("dominate");
  });
});
