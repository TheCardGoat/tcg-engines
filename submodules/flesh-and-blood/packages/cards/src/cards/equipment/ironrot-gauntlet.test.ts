import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ironrotGauntlet } from "./ironrot-gauntlet.ts";

describe("Ironrot Gauntlet (RNR006) AAA", () => {
  it("happy: Blade Break destroys the gauntlet after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, arms: [ironrotGauntlet], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(ironrotGauntlet);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, ironrotGauntlet).toBeIn("graveyard");
  });

  it("boundary: no activated abilities — cannot be activated", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [ironrotGauntlet], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );

    expect(() => game.as(bravo).activate(ironrotGauntlet)).toThrow();
    expectFabCard(game.as(bravo), ironrotGauntlet).toBeIn("arms");
    expectFabCard(game.as(bravo), ironrotGauntlet).toHaveKeyword("blade-break");
    expectFabCard(game.as(bravo), ironrotGauntlet).toHaveDefense(1);
  });

  it("timing: unused gauntlet stays equipped through the end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [ironrotGauntlet], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();

    expectFabCard(Bravo, ironrotGauntlet).toBeIn("arms");
    expectFabCard(Bravo, ironrotGauntlet).toHaveDefense(1);
  });
});
