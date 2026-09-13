import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { clapEmInIronsBlue } from "./clap-em-in-irons.ts";

describe("Clap 'em in Irons (SEA209) AAA", () => {
  it("happy: entering the arena taps target Pirate hero", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [clapEmInIronsBlue], actionPoints: 1, deck: 6 },
      { hero: gravyBones, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(clapEmInIronsBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, clapEmInIronsBlue).toBeIn("arena");
    expectFabCard(game.as(gravyBones), gravyBones).toBeTapped();
  });

  it("boundary: a non-Pirate hero is not a legal tap target", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [clapEmInIronsBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(clapEmInIronsBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, clapEmInIronsBlue).toBeIn("arena");
    expectFabCard(game.as(bravo), bravo).toBeReady();
  });

  it("timing: destroyed at the start of your next turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [clapEmInIronsBlue], actionPoints: 1, deck: 6 },
      { hero: gravyBones, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Gravy = game.as(gravyBones);

    Dash.play(clapEmInIronsBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
    Dash.endTurn();
    Gravy.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, clapEmInIronsBlue).toBeIn("graveyard");
  });
});
