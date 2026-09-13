import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { scaldingRainRed } from "./scalding-rain.ts";
import { piercingShadowViseRed } from "./piercing-shadow-vise.ts";

/**
 * Piercing Shadow Vise, Red (CHN010) — Shadow Runeblade Attack Action.
 *
 * Printed: "You may play Piercing Shadow Vise from your banished zone.
 * If you have dealt arcane damage to an opposing hero this turn, Piercing
 * Shadow Vise gains +2{p}. Blood Debt"
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability generates its effect when the
 *     card-layer resolves), CR 6.2 (layer-continuous modify-numeric on the
 *     chain link), CR 8.5.3b (arcane damage is dealt by an effect),
 *     CR 8.3.11/8.3.11a (Blood Debt — lose 1 at the beginning of the
 *     owner's end phase while public in the banished zone), CR 2.9 (power).
 *   behaviorConstraints:
 *     - The static play permission allows playing the card from the
 *       controller's banished zone (normal action timing and costs apply).
 *     - The +2{p} applies only if arcane damage was dealt to an opposing
 *       hero EARLIER THIS TURN; without it the attack stays printed 4{p}.
 *     - A copy still in the banished zone at the beginning of the owner's
 *       end phase costs 1 life (Blood Debt).
 *   testImplications:
 *     - After a 4-damage arcane ping, the vise played FROM BANISHED reads
 *       4+2 = 6{p}; with no arcane damage this turn it reads 4{p}; an
 *       unplayed banished copy drains 1 life at the end phase.
 */

describe("Piercing Shadow Vise (CHN010) AAA", () => {
  it("happy: after arcane damage to the opposing hero, the vise from banished reads 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [scaldingRainRed],
        banished: [piercingShadowViseRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    // Scalding Rain deals 4 arcane damage to the opposing hero this turn.
    Chane.play(scaldingRainRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(16);

    // The static permission plays the vise straight from the banished zone.
    Chane.attackWith(piercingShadowViseRed, { from: "banished" });
    game.advanceCombatTo("defend");
    // Printed 4{p} + 2 arcane-conditional = 6.
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: no arcane damage this turn — the vise stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [piercingShadowViseRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.attackWith(piercingShadowViseRed, { from: "banished" });
    game.advanceCombatTo("defend");
    // No arcane damage was dealt this turn: the conditional +2 never
    // applies (the banished-zone play itself is still legal).
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: Blood Debt — a copy left in banished costs 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [], banished: [piercingShadowViseRed], life: 20, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.endTurn();
    game.helpers.untilIdle();

    // CR 8.3.11: the public blood-debt card in the banished zone drains 1
    // life at the beginning of Chane's end phase.
    expectFabPlayer(Chane).toHaveLife(19);
  });
});
