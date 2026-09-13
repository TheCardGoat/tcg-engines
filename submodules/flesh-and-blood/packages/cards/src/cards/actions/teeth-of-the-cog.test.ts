import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { cerebellumProcessorBlue } from "./cerebellum-processor.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { teethOfTheCogRed } from "./teeth-of-the-cog.ts";

/**
 * Teeth of the Cog, Red (SEA030) — Mechanologist Attack, 0-cost 4{p}/2{d}.
 * Printed: Galvanize — When this defends, you may destroy an item you control.
 * If you do, create a Golden Cog token.
 */

describe("Teeth of the Cog (SEA030) AAA", () => {
  it("happy: destroying an item you control creates a Golden Cog", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [teethOfTheCogRed],
        arena: [cerebellumProcessorBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(teethOfTheCogRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Dash.target(cerebellumProcessorBlue);

    expectFabCard(Dash, cerebellumProcessorBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 1);
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: declining the destroy does not create a Golden Cog", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [teethOfTheCogRed],
        arena: [cerebellumProcessorBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(teethOfTheCogRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, cerebellumProcessorBlue).toBeIn("arena");
    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 0);
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("timing: with no item the optional cannot create a Golden Cog", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [teethOfTheCogRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(teethOfTheCogRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 0);
    expectFabPlayer(Dash).toHaveLife(18);
  });
});
