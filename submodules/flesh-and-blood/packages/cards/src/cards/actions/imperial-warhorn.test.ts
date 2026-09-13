import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { rustedRelicBlue } from "./rusted-relic.ts";
import { imperialWarhornRed } from "./imperial-warhorn.ts";

describe("Imperial Warhorn (DYN242) AAA", () => {
  it("happy: plays as a legendary item", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [imperialWarhornRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], arena: [rustedRelicBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(imperialWarhornRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, imperialWarhornRed).toBeIn("arena");
  });

  it("boundary: at 0{r} the Warhorn stays and the opposing item is not destroyed", () => {
    const game = FabTestEngine.start(
      { hero: dash, arena: [imperialWarhornRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], arena: [rustedRelicBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(imperialWarhornRed);

    expectFabCard(Dash, imperialWarhornRed).toBeIn("arena");
    expectFabCard(game.as(bravo), rustedRelicBlue).toBeIn("arena");
  });

  it("timing: paying {r} and destroying the Warhorn spends the activation", () => {
    const game = FabTestEngine.start(
      { hero: dash, arena: [imperialWarhornRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], arena: [rustedRelicBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(imperialWarhornRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, imperialWarhornRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });
});
