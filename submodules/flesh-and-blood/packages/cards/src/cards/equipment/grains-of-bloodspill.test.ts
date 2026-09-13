import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { snatchRed } from "../actions/snatch.ts";
import { grainsOfBloodspill } from "./grains-of-bloodspill.ts";

describe("Grains of Bloodspill (HVY097) AAA", () => {
  it("happy: paying {r} when a weapon attack hits creates a Vigor token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        chest: [grainsOfBloodspill],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(dawnblade);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 1).toHaveResourceCount(0);
    expectFabCard(Bravo, grainsOfBloodspill).toBeIn("chest");
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("boundary: declining the payment creates no Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        chest: [grainsOfBloodspill],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(dawnblade);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0).toHaveResourceCount(1);
    expectFabCard(Bravo, grainsOfBloodspill).toBeIn("chest");
  });

  it("timing: an attack-action hit does not create Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [grainsOfBloodspill],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0).toHaveResourceCount(1);
    expectFabCard(Bravo, grainsOfBloodspill).toBeIn("chest");
  });
});
