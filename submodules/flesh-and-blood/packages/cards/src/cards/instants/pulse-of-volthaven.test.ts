import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fryRed } from "../actions/fry.ts";
import { lexi } from "../heroes/lexi.ts";
import { heavenSClawsRed } from "../actions/heaven-s-claws.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { pulseOfVolthavenRed } from "./pulse-of-volthaven.ts";

/**
 * Pulse of Volthaven, Red (ELE112) — Lightning Ice Instant, cost 0, Legendary.
 *
 * Printed: "Your next Ice, Lightning, or Elemental attack this turn gains +4{p}."
 */

describe("Pulse of Volthaven (ELE112) AAA", () => {
  it("happy: the next Lightning attack gains +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [pulseOfVolthavenRed, fryRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    Lexi.play(pulseOfVolthavenRed);
    game.helpers.resolveUntilIdle();
    Lexi.attackWith(fryRed);
    game.advanceCombatTo("defend");

    // Fry printed 3 + 4 = 7.
    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Lexi, pulseOfVolthavenRed).toBeIn("graveyard");
  });

  it("boundary: a Generic attack does not get +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [pulseOfVolthavenRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    Lexi.play(pulseOfVolthavenRed);
    game.helpers.resolveUntilIdle();
    Lexi.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the latch is next-only — a second Lightning attack stays at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [pulseOfVolthavenRed, fryRed, heavenSClawsRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    Lexi.play(pulseOfVolthavenRed);
    game.helpers.resolveUntilIdle();
    Lexi.attackWith(fryRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();

    Lexi.attackWith(heavenSClawsRed);
    game.advanceCombatTo("defend");
    // Heaven's Claws printed 5; the Pulse latch was consumed by Fry.
    expectCombat(game).toHaveAttackPower(5);
  });
});
