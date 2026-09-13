import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { lexi } from "../heroes/lexi.ts";
import { dash } from "../heroes/dash.ts";
import { snagBlue } from "../instants/snag.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { coldWaveRed } from "./cold-wave.ts";

/**
 * Cold Wave (ELE038) — Elemental Ranger Arrow Attack, cost 1, 5{p}, 3{d}.
 *
 * Printed: "Ice Fusion. If Cold Wave was fused, cards and activated abilities
 * cost opposing heroes an additional {r} this turn."
 *
 * Extra {r} is an opponent-targeted unbounded play/activate cost latch when fused.
 */

describe("Cold Wave (ELE038) AAA", () => {
  it("happy: fused Cold Wave attacks at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [coldWaveRed],
        hand: [weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    Lexi.attackWith(coldWaveRed, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveIceRed],
    });

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Lexi, weaveIceRed).toBeIn("hand");
  });

  it("boundary: unfused, an opposing 0-cost instant still plays at 0{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [coldWaveRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snagBlue], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.attackWith(coldWaveRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    game.advanceCombatTo("reaction");
    Lexi.pass();
    Dash.play(snagBlue);
    game.passBoth();

    expectFabCard(Dash, snagBlue).toBeIn("graveyard");
  });

  it("timing: fused extra {r} surcharges an opposing 0-cost instant", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [coldWaveRed],
        hand: [weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snagBlue], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.attackWith(coldWaveRed, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    game.advanceCombatTo("reaction");
    Lexi.pass();
    expectFabUnplayable(() => Dash.play(snagBlue));
    expectFabCard(Dash, snagBlue).toBeIn("hand");
  });
});
