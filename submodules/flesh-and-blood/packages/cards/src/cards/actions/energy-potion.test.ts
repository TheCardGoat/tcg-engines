import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { energyPotionBlue } from "./energy-potion.ts";

describe("Energy Potion (KSU029) AAA", () => {
  it("happy: Instant destroy this gains {r}{r}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [energyPotionBlue], actionPoints: 1, resourcePoints: 0, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(energyPotionBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, energyPotionBlue).toBeIn("arena");

    Dash.activate(energyPotionBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, energyPotionBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveResourceCount(2);
  });

  it("boundary: a destroyed potion cannot be activated again", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [energyPotionBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(energyPotionBlue);
    game.helpers.resolveUntilIdle();
    Dash.activate(energyPotionBlue);
    game.helpers.resolveUntilIdle();

    expect(() => Dash.activate(energyPotionBlue)).toThrow();
    expectFabCard(Dash, energyPotionBlue).toBeIn("graveyard");
  });

  it("timing: Instant activation is legal on the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], actionPoints: 1, deck: 6 },
      { hero: bravo, arena: [energyPotionBlue], resourcePoints: 0, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.pass();
    Bravo.activate(energyPotionBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveResourceCount(2);
    expectFabCard(Bravo, energyPotionBlue).toBeIn("graveyard");
  });
});
