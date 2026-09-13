import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { rubbleRaiserRed } from "./rubble-raiser.ts";

describe("Rubble Raiser (MPG082) AAA", () => {
  it("happy: attacks for printed 8 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [rubbleRaiserRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(rubbleRaiserRed);
    expectCombat(game).toHaveAttackPower(8);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(12);
    expectFabCard(Bravo, rubbleRaiserRed).toBeIn("graveyard");
  });

  it("boundary: cannot be played without paying the 4-resource cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [rubbleRaiserRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(bravo).attackWith(rubbleRaiserRed)).toThrow();
    expectFabCard(game.as(bravo), rubbleRaiserRed).toBeIn("hand");
  });

  it("timing: Heave 2 at end of turn arsenals this and creates 2 Seismic Surges", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [rubbleRaiserRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.advanceToDecision(Bravo, "entity-target");
    Bravo.chooseTargets(rubbleRaiserRed);

    expectFabCard(Bravo, rubbleRaiserRed).toBeIn("arsenal");
    expectFabCard(Bravo, rubbleRaiserRed).toBeFaceUp();
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 2);
  });
});
