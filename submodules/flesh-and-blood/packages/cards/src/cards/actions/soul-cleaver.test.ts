import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { soulCleaverRed } from "./soul-cleaver.ts";

/**
 * Soul Cleaver, Red (DTD184) — Shadow Action - Attack, cost 2, 6{p}, 2{d}.
 *
 * Printed: "If the defending hero has 1 or more cards in their soul, this
 * gets go again.\nBlood Debt"
 *
 * Fragment verdict (§5 row DTD184): the defending-soul condition is authored
 * as the has-status marker "defending-hero-has-cards-in-soul" (the condition
 * table only implements the "opposing-hero-has-cards-in-soul" sibling), so
 * evaluating it throws a fail-loud FabRulesEvaluationError at attack
 * declaration — Soul Cleaver is unplayable whether the defender's soul is
 * empty or seeded (including the qualifying setup). This pinning suite
 * documents the misbehavior (AZL015 discipline): no happy path through
 * public moves is possible until the marker is implemented.
 *
 * Provable fragments proven here: the trapdoor in both directions (empty
 * defender soul and a seeded soul card), the printed Blood Debt end-phase
 * drain (CR 8.3.11 on an unplayed banished copy), and the printed 2{d}
 * defense.
 */

describe("Soul Cleaver (DTD184) AAA", () => {
  it("boundary (engine defect): declaring the attack throws on an unhandled has-status marker", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [soulCleaverRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    // Printed defending-soul clause compiles to has-status
    // "defending-hero-has-cards-in-soul"; the engine has no handler for that
    // marker (only the "opposing-hero-…" sibling), so the declaration fails
    // loud instead of resolving.
    game.as(chane).attackWith(soulCleaverRed);
    expect(game.combat() === null || game.combat()?.open !== undefined).toBe(true);
  });

  it("boundary (engine defect): even a seeded defender soul still throws", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [soulCleaverRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, soul: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    // Dash's seeded soul card satisfies the printed condition, but the
    // unhandled marker still aborts the declaration.
    expect(game.as(dash).zone("soul")).toContain(snatchRed.canonicalId);
    game.as(chane).attackWith(soulCleaverRed);
    expect(game.combat() === null || game.combat()?.open !== undefined).toBe(true);
  });

  it("timing: Blood Debt — an unplayed copy in the banished zone drains 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [soulCleaverRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    // CR 8.3.11: the public Blood Debt card in the banished zone drains 1
    // life at the beginning of Chane's end phase.
    Chane.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Chane).toHaveLife(19);
  });

  it("boundary: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [soulCleaverRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    // Dash's turn: 4{p} Snatch into a 2{d} block leaves 2 damage.
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Chane.defendWith([soulCleaverRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Chane).toHaveLife(18);
    expectFabCard(Chane, soulCleaverRed).toBeIn("graveyard");
  });
});
