import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { snatchRed } from "../actions/snatch.ts";
import { rapidReflexRed } from "../attack-reactions/rapid-reflex.ts";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { redAlertVest } from "./red-alert-vest.ts";

/**
 * Red Alert Vest (HNT193) — "If an attack reaction has been played or
 * activated this chain link, this gets +1{d}." Printed 1{d}.
 */

describe("Red Alert Vest (HNT193) AAA", () => {
  it("happy: after an AR this chain, the vest defends for 2", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, rapidReflexRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, chest: [redAlertVest], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Fai = game.as(fai);

    Fai.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(redAlertVest);
    game.toReaction("attacker");
    Fai.must.playReaction(rapidReflexRed);
    game.passBoth();
    expectFabCard(Dash, redAlertVest).toHaveDefense(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: with no AR this chain the vest stays 1{d}", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [redAlertVest], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(fai).playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(redAlertVest);
    expectFabCard(Dash, redAlertVest).toHaveDefense(1);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(17);
  });
});
