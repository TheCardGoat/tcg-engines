import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { tectonicPlating } from "../equipment/tectonic-plating.ts";
import { nervesOfSteelBlue } from "./nerves-of-steel.ts";

/**
 * Nerves of Steel (EVR023) — Guardian Aura, cost 3.
 * Printed: when this enters the arena, remove a -1{d} counter from a chest
 * equipment you control. Battleworn/temper on your equipment does not trigger
 * if it defends an attack with 2 or less {p}. When your hero is dealt damage,
 * destroy this.
 */

describe("Nerves of Steel (EVR023) AAA", () => {
  it("happy: entering the arena removes a -1{d} counter from chest equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [{ card: tectonicPlating, state: { defenseCounterTotal: -1 } }],
        hand: [nervesOfSteelBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(nervesOfSteelBlue);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, nervesOfSteelBlue).toBeIn("arena");
    expectFabCard(Bravo, tectonicPlating).toHaveDefenseCounters(0);
  });

  it("boundary: without chest equipment this still enters as an aura", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nervesOfSteelBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(nervesOfSteelBlue);
    game.untilIdle();

    expectFabCard(Bravo, nervesOfSteelBlue).toBeIn("arena");
  });

  it("timing: damage to your hero destroys this", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: bravo,
        arena: [nervesOfSteelBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, nervesOfSteelBlue).toBeIn("graveyard");
  });
});
