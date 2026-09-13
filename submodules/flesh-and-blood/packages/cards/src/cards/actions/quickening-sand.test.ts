import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { flamebornRetributionRed } from "./flameborn-retribution.ts";
import { snatchRed } from "./snatch.ts";
import { quickeningSandBlue } from "./quickening-sand.ts";

describe("Quickening Sand (PEN088) AAA", () => {
  it("happy: playing this creates a Quicken token under the targeted hero", () => {
    const game = FabTestEngine.start(
      { hero: azalea, hand: [quickeningSandBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(quickeningSandBlue, { target: Dash.id });
    game.untilIdle();

    expectFabPlayer(Dash).toHaveTokenCount("quicken", 1);
    expectFabPlayer(Azalea).toHaveTokenCount("quicken", 0);
  });

  it("boundary: defending an attack without go again does not tap the attacking hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: azalea, hand: [quickeningSandBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.as(azalea).defendWith(quickeningSandBlue);
    game.passBoth();

    expectFabPlayer(game.as(azalea)).toHaveTokenCount("quicken", 0);
  });

  it("timing: defending an attack with go again taps the targeted hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [flamebornRetributionRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [quickeningSandBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(flamebornRetributionRed);
    Azalea.defendWith(quickeningSandBlue);
    Azalea.target(Bravo);
    game.passBoth();

    expectFabCard(Bravo, bravo).toBeTapped();
  });
});
