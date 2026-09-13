import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { healingBalmBlue } from "../actions/healing-balm.ts";
import { snatchRed } from "../actions/snatch.ts";
import { parchedTerrainRed } from "./parched-terrain.ts";

describe("Parched Terrain (SUP260) AAA", () => {
  it("happy: heroes can't gain {h} while this is in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [parchedTerrainRed, healingBalmBlue],
        resourcePoints: 1,
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(parchedTerrainRed);
    game.untilIdle();
    expectFabCard(Bravo, parchedTerrainRed).toBeIn("arena");
    Bravo.play(healingBalmBlue);
    game.untilIdle();
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: without this aura, Healing Balm still gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [healingBalmBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(healingBalmBlue);
    game.untilIdle();
    expectFabPlayer(Bravo).toHaveLife(21);
  });

  it("timing: one red card pays for the first sand counter and preserves the aura", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [parchedTerrainRed],
        graveyard: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(parchedTerrainRed);
    game.untilIdle();
    Bravo.endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });
    expectFabCard(Bravo, parchedTerrainRed).toBeIn("arena").toHaveCounters(1, "sand");
    expectFabCard(Bravo, snatchRed).toBeIn("banished");
  });
});
