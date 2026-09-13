import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { nuu } from "../heroes/nuu.ts";
import { dash } from "../heroes/dash.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { bloodSplatteredVest } from "./blood-splattered-vest.ts";

/**
 * Blood Splattered Vest (FAB293) — Assassin/Ninja Chest d1, Blade Break.
 * Printed: "Whenever a dagger you control hits, you may gain {r} and put a
 * stain counter on this. Then if there are 3 or more stain counters on this,
 * destroy it."
 * The dagger is the real Nerve Scalpel weapon.
 */

describe("Blood Splattered Vest (FAB293) AAA", () => {
  it("happy: accepting on a dagger hit gains {r} and stains the vest", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        chest: [bloodSplatteredVest],
        weapon1: [nerveScalpel],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.activate(nerveScalpel);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Nuu, bloodSplatteredVest).toBeIn("chest");
    expectFabCard(Nuu, bloodSplatteredVest).toHaveCounters(1, "stain");
    expectFabPlayer(Nuu).toHaveResourceCount(1);
  });

  it("third stain: the vest is destroyed once it holds 3 stain counters", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        chest: [{ card: bloodSplatteredVest, state: { namedCounters: { stain: 2 } } }],
        weapon1: [nerveScalpel],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.activate(nerveScalpel);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Nuu, bloodSplatteredVest).toBeIn("graveyard");
    expectFabPlayer(Nuu).toHaveResourceCount(1);
  });

  it("boundary: declining keeps the vest unstained and gains nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        chest: [{ card: bloodSplatteredVest, state: { namedCounters: { stain: 2 } } }],
        weapon1: [nerveScalpel],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.activate(nerveScalpel);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Nuu, bloodSplatteredVest).toBeIn("chest");
    expectFabCard(Nuu, bloodSplatteredVest).toHaveCounters(2, "stain");
    expectFabPlayer(Nuu).toHaveResourceCount(0);
  });
});
