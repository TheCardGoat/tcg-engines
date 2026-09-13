import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { snatchRed } from "./snatch.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { rotaryRamRed } from "./rotary-ram.ts";

/**
 * Rotary Ram (EVR082) — Mechanologist Action, cost 0, 3{d}, go again.
 *
 * Printed: "The next Mechanologist attack action card you play this turn
 * gains +3{p}.
 * If you have boosted this turn, put Rotary Ram on the bottom of your deck.
 * Go again"
 */

describe("Rotary Ram (EVR082) AAA", () => {
  it("happy: the next Mechanologist attack action this turn gains +3{p} and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [rotaryRamRed, zeroToSixtyRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(rotaryRamRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(2);
    expectFabCard(Dash, rotaryRamRed).toBeIn("graveyard");

    Dash.must.playAttack(zeroToSixtyRed);
    game.advanceCombatTo("defend");
    // Zero to Sixty base 4 + 3 from Rotary Ram.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a Generic attack gets nothing and does not consume the modifier", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [rotaryRamRed, snatchRed, zeroToSixtyRed],
        actionPoints: 3,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(rotaryRamRed);
    game.helpers.resolveUntilIdle();

    Dash.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);

    game.advanceCombatTo("resolution");
    Dash.must.playAttack(zeroToSixtyRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: if you have boosted this turn, Rotary Ram goes to the bottom of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [rotaryRamRed, zeroToSixtyRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(zeroToSixtyRed, { boost: true });
    game.helpers.resolveRestOfCombat();

    Dash.play(rotaryRamRed);
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("graveyard")).not.toContain(rotaryRamRed.canonicalId);
    expect(Dash.zone("deck")[0]).toBe(rotaryRamRed.canonicalId);
  });
});
