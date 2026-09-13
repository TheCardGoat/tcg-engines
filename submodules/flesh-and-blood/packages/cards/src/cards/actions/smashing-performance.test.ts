import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { nimblismBlue } from "./nimblism.ts";
import { healingPotionBlue } from "./healing-potion.ts";
import { smashingPerformanceYellow } from "./smashing-performance.ts";

describe("Smashing Performance (EVO237) AAA", () => {
  it("happy: discarding a 6+{p} card this way destroys a random item in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smashingPerformanceYellow],
        deck: [commandAndConquerRed],
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: dash, hand: [], arena: [healingPotionBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(smashingPerformanceYellow);
    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Rhinar, commandAndConquerRed).toBeIn("graveyard");
    expectFabCard(game.as(dash), healingPotionBlue).toBeIn("graveyard");
  });

  it("boundary: discarding a sub-6{p} card this way does not destroy an item", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smashingPerformanceYellow],
        deck: [nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: dash, hand: [], arena: [healingPotionBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(smashingPerformanceYellow);
    expectFabCard(Rhinar, nimblismBlue).toBeIn("graveyard");
    expectFabCard(game.as(dash), healingPotionBlue).toBeIn("arena");
  });

  it("timing: with no item in the arena, a 6+{p} discard still opens combat", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smashingPerformanceYellow],
        deck: [commandAndConquerRed],
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(smashingPerformanceYellow);
    expectCombat(game).toBeOpen();
    expectFabCard(Rhinar, commandAndConquerRed).toBeIn("graveyard");
  });
});
