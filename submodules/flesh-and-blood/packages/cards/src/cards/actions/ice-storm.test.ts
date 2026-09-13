import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { lexi } from "../heroes/lexi.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { iceStormRed } from "./ice-storm.ts";

/**
 * Ice Storm (ELE037) — Elemental Ranger Action, cost 0, 2{d}, go again.
 *
 * Printed: "Ice and Lightning Fusion. Your next arrow attack this turn gains
 * +3{p}. If Ice Storm was fused, your next arrow attack this turn gains
 * \"If this hits a hero, deal 1 damage to them\" and \"Whenever this attack
 * deals damage to a hero, create that many Frostbite tokens under their
 * control.\" Go again"
 */

describe("Ice Storm (ELE037) AAA", () => {
  it("happy: the next arrow attack this turn gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        hand: [iceStormRed],
        arsenal: [searingShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    Lexi.play(iceStormRed);
    game.helpers.resolveUntilIdle();
    Lexi.attackWith(searingShotRed, { from: "arsenal" });

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a non-arrow attack does not gain +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [iceStormRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    Lexi.play(iceStormRed);
    game.helpers.resolveUntilIdle();
    Lexi.attackWith(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [iceStormRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    expectFabPlayer(Lexi).toHaveAP(1);
    Lexi.play(iceStormRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Lexi).toHaveAP(1);
    expectFabCard(Lexi, iceStormRed).toBeIn("graveyard");
  });

  it("happy: fused, the next arrow's hit creates Frostbite tokens under the defender", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        hand: [iceStormRed, weaveIceRed, lightningPressRed],
        arsenal: [searingShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.play(iceStormRed, {
      fuse: true,
      fuseCards: [weaveIceRed, lightningPressRed],
    });
    game.helpers.resolveUntilIdle();
    expectFabCard(Lexi, weaveIceRed).toBeIn("hand");
    expectFabCard(Lexi, lightningPressRed).toBeIn("hand");

    Lexi.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ ordering: "listed" });

    expect(Dash.zone("arena")).toContain("token:frostbite");
    expectFabCard(Lexi, iceStormRed).toBeIn("graveyard");
  });
});
