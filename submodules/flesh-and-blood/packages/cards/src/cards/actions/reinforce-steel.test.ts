import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { bastionOfUnity } from "../equipment/bastion-of-unity.ts";
import { steelbraidBuckler } from "../equipment/steelbraid-buckler.ts";
import { reinforceSteelRed } from "./reinforce-steel.ts";

/**
 * Reinforce Steel Red (DYN039) — Guardian Action, cost 2.
 *
 * Printed: Remove a -1{d} counter from a Guardian off-hand you control with
 * 3 or less base {d}.
 */

describe("Reinforce Steel (DYN039) AAA", () => {
  it("happy: removes a -1{d} counter from a Guardian off-hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [reinforceSteelRed],
        weapon2: [{ card: steelbraidBuckler, state: { defenseCounterTotal: -1 } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(reinforceSteelRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, steelbraidBuckler).toHaveDefenseCounters(0);
  });

  it("boundary: a Warrior off-hand keeps its -1{d} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [reinforceSteelRed],
        weapon2: [{ card: bastionOfUnity, state: { defenseCounterTotal: -1 } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(reinforceSteelRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, bastionOfUnity).toHaveDefenseCounters(-1);
  });

  it("timing: the Action still resolves with no counter to remove", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [reinforceSteelRed],
        weapon2: [steelbraidBuckler],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(reinforceSteelRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, reinforceSteelRed).toBeIn("graveyard");
    expectFabCard(Bravo, steelbraidBuckler).toHaveDefenseCounters(0);
  });
});
