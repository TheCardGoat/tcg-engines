import { describe, expect, it } from "vitest";
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
import { frostLockBlue } from "./frost-lock.ts";

/**
 * Frost Lock (ELE035) — Elemental Ranger Arrow Attack, cost 1, 3{p}, 3{d}.
 *
 * Printed: "Ice Fusion. Cards and activated abilities cost opposing heroes an
 * additional {r} this turn. If Frost Lock was fused, it gains +1{p} and
 * \"If this hits a hero, until the end of their next turn they can't pitch
 * or play cards with base cost 0.\""
 *
 * Extra {r} is an opponent-targeted unbounded play/activate cost latch.
 */

describe("Frost Lock (ELE035) AAA", () => {
  it("happy: fused Frost Lock gains +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [frostLockBlue],
        hand: [weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    Lexi.attackWith(frostLockBlue, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveIceRed],
    });

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Lexi, weaveIceRed).toBeIn("hand");
  });

  it("boundary: unfused Frost Lock stays at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [frostLockBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(lexi).attackWith(frostLockBlue, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: an arrow can only be played from arsenal with a bow", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        hand: [frostLockBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(lexi).attackWith(frostLockBlue)).toThrow();
    expectFabCard(game.as(lexi), frostLockBlue).toBeIn("hand");
  });

  it("happy: opposing cards cost an additional {r} this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [frostLockBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snagBlue], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.attackWith(frostLockBlue, { from: "arsenal" });
    game.advanceCombatTo("reaction");
    Lexi.pass();
    expectFabUnplayable(() => Dash.play(snagBlue));
    expectFabCard(Dash, snagBlue).toBeIn("hand");
  });
});
