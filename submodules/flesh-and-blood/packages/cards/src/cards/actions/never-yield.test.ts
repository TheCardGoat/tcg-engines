import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { neverYieldBlue } from "./never-yield.ts";

describe("Never Yield (DYN029) AAA", () => {
  it("happy: start of turn removes a -1{d} counter when you control fewer equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [neverYieldBlue],
        chest: [{ card: ironrotPlate, state: { defenseCounterTotal: -1 } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        head: [ironrotHelm],
        chest: [ironrotPlate],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.as(dash).endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Bravo, neverYieldBlue).toBeIn("graveyard");
    expectFabCard(Bravo, ironrotPlate).toHaveDefenseCounters(0);
  });

  it("boundary: equal equipment leaves the -1{d} counter in place", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [neverYieldBlue],
        chest: [{ card: ironrotPlate, state: { defenseCounterTotal: -1 } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      { hero: dash, head: [ironrotHelm], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.as(dash).endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Bravo, neverYieldBlue).toBeIn("graveyard");
    expectFabCard(Bravo, ironrotPlate).toHaveDefenseCounters(-1);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [neverYieldBlue], hand: [], life: 10, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).endTurn();
    game.untilIdle();
    expectFabCard(game.as(bravo), neverYieldBlue).toBeIn("arena");
    expectFabPlayer(game.as(bravo)).toHaveLife(10);
  });
});
