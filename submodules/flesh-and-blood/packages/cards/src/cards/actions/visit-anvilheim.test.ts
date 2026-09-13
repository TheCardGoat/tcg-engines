import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { steelbraidBuckler } from "../equipment/steelbraid-buckler.ts";
import { bastionOfUnity } from "../equipment/bastion-of-unity.ts";
import { visitAnvilheimBlue } from "./visit-anvilheim.ts";

/**
 * Visit Anvilheim (MPG021) — Guardian Action, printed cost X.
 *
 * Printed: Remove X -1{d} counters from a Guardian off-hand you have equipped.
 *
 * Catalog omits numeric `cost`; `{ type: "x" }` binds `play({ xValue })`.
 * Equipped Off-Hands seat in the weapon zone (Reinforce Steel).
 */

describe("Visit Anvilheim (MPG021) AAA", () => {
  it("happy: X=2 removes two -1{d} counters from a Guardian off-hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [visitAnvilheimBlue],
        weapon2: [{ card: steelbraidBuckler, state: { defenseCounterTotal: -3 } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(visitAnvilheimBlue, { xValue: 2 });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, steelbraidBuckler).toHaveDefenseCounters(-1);
    expectFabCard(Bravo, visitAnvilheimBlue).toBeIn("graveyard");
  });

  it("boundary: X=0 leaves the -1{d} counters on the off-hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [visitAnvilheimBlue],
        weapon2: [{ card: steelbraidBuckler, state: { defenseCounterTotal: -3 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(visitAnvilheimBlue, { xValue: 0 });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, steelbraidBuckler).toHaveDefenseCounters(-3);
  });

  it("boundary: X greater than the available counters removes as many as possible", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [visitAnvilheimBlue],
        weapon2: [{ card: steelbraidBuckler, state: { defenseCounterTotal: -3 } }],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(visitAnvilheimBlue, { xValue: 5 });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, steelbraidBuckler).toHaveDefenseCounters(0);
    expectFabCard(Bravo, visitAnvilheimBlue).toBeIn("graveyard");
  });

  it("timing: a Warrior off-hand is not a Guardian off-hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [visitAnvilheimBlue],
        weapon2: [{ card: bastionOfUnity, state: { defenseCounterTotal: -2 } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(visitAnvilheimBlue, { xValue: 2 });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, bastionOfUnity).toHaveDefenseCounters(-2);
    expectFabCard(Bravo, visitAnvilheimBlue).toBeIn("graveyard");
  });
});
