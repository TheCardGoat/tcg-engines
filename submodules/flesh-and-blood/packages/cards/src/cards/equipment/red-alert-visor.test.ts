import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rapidReflexRed } from "../attack-reactions/rapid-reflex.ts";
import { redAlertVisor } from "./red-alert-visor.ts";

/**
 * Red Alert Visor (HNT192) — "If an attack reaction has been played or
 * activated this chain link, this gets +1{d}." Printed 1{d}.
 */

describe("Red Alert Visor (HNT192) AAA", () => {
  it("happy: after an AR this chain, the visor defends for 2", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, rapidReflexRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, head: [redAlertVisor], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Fai = game.as(fai);

    Fai.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(redAlertVisor);
    game.toReaction("attacker");
    Fai.must.playReaction(rapidReflexRed);
    game.passBoth();
    expectFabCard(Dash, redAlertVisor).toHaveDefense(2);
    game.helpers.resolveRestOfCombat();
    // Snatch 4 + Rapid Reflex 3 = 7 vs 2{d} → 5 damage.
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: with no AR this chain the visor stays 1{d}", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, head: [redAlertVisor], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(fai).playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(redAlertVisor);
    expectFabCard(Dash, redAlertVisor).toHaveDefense(1);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(17); // 20 - (4 - 1)
  });

  it("timing: an AR on a prior chain does not raise the next-link visor", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, snatchRed, rapidReflexRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, head: [redAlertVisor], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Fai = game.as(fai);

    Fai.playAttack(snatchRed);
    game.toReaction("attacker");
    Fai.must.playReaction(rapidReflexRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    Fai.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(redAlertVisor);
    expectFabCard(Dash, redAlertVisor).toHaveDefense(1);
  });
});
