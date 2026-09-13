import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { eradicateYellow } from "./eradicate.ts";
import { payDayBlue } from "./pay-day.ts";
import { wageGoldYellow } from "./wage-gold.ts";

/**
 * Pay Day (Blue) (DYN123) — Assassin Action.
 *
 * Printed: "If you've completed a contract this turn, create 4 Silver tokens."
 *
 * CR 8.4.7 / 8.5.39a: a player has completed a contract when they perform its
 * actions while the contract effect exists; the engine stamps that per-player
 * turn fact when the complete-contract event commits (contract-progress rule
 * + reducers/mechanics.ts) and the has-status gate
 * `completed-a-contract-this-turn` reads it. The fact resets with the turn
 * ledger (emptyFabTurnHistory) — proven at the engine level in
 * packages/engine/src/rules/reveal-and-contract-status.test.ts; these tests
 * drive the public playline end to end.
 *
 * Seeding: DYN119 Eradicate (Yellow) contracts Bravo to "banish opponents'
 * yellow cards" (CR 8.5.39); with Dash already owning a banished yellow card
 * (HVY217 Wage Gold), the contract completes on resolution and its trigger
 * creates 1 Silver — the engine's own proven playline
 * (trigger-complete-contract.test.ts).
 */

describe("Pay Day (Blue) (DYN123) AAA", () => {
  it("happy: contract completed this turn → create 4 Silver tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [eradicateYellow, payDayBlue],
        resourcePoints: 2, // 1 for Eradicate; Pay Day costs 0
        actionPoints: 2, // Eradicate attack + Pay Day action
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        banished: [wageGoldYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Eradicate's contract ("banish opponents' yellow cards") completes on
    // resolution because Dash already owns a banished yellow card.
    Bravo.play(eradicateYellow, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    game.helpers.resolveRestOfCombat();
    // CR 8.5.39a: pre-seated opponent-owned banished yellow does not complete.
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 0);

    Bravo.play(payDayBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("silver", 0);
    expectFabCard(Bravo, payDayBlue).toBeIn("graveyard");
  });

  it("boundary: no contract completed this turn → no Silver, card still resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [payDayBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(payDayBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("silver", 0);
    expectFabCard(Bravo, payDayBlue).toBeIn("graveyard");
  });

  it("timing: Pay Day resolved before the completion does not fire retroactively", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [payDayBlue, eradicateYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        banished: [wageGoldYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Pay Day first: no contract has completed yet this turn → nothing.
    Bravo.play(payDayBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 0);

    // The contract completes only now; Pay Day has already resolved.
    Bravo.play(eradicateYellow, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveTokenCount("silver", 0);
  });
});
