import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { ballLightningYellow } from "./ball-lightning.ts";
import { ballLightningRed } from "./ball-lightning.ts";

/**
 * Ball Lightning Red (ELE186) — Lightning Attack Action, 3{p}, go again.
 *
 * Printed: Whenever a Lightning or Elemental action card would deal damage
 * this combat chain, instead it deals that much damage plus 1.
 */

describe("Ball Lightning (ELE186) AAA", () => {
  it("happy: an unblocked 3{p} Lightning hit deals 4", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [ballLightningRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(ballLightningRed);
    Bravo.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(16);
  });

  it("boundary: a generic follow-up attack this chain is not boosted", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ballLightningRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(ballLightningRed);
    Bravo.defendWith();
    game.advanceCombatTo("resolution");
    Dash.playAttack(snatchRed);
    Bravo.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(12);
  });

  it("timing: a later Lightning attack this chain also deals plus 1", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ballLightningRed, ballLightningYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(ballLightningRed);
    Bravo.defendWith();
    game.advanceCombatTo("resolution");
    Dash.playAttack(ballLightningYellow);
    Bravo.defendWith();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Red 3+1, yellow 2+1 (red's this-combat-chain) +1 (yellow's own) = 8.
    expectFabPlayer(Bravo).toHaveLife(12);
  });
});
