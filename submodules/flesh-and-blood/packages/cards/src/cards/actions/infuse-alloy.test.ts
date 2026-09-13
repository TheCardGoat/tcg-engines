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
import { infuseAlloyRed } from "./infuse-alloy.ts";

/**
 * Infuse Alloy, Red (EVO120) — Mechanologist Attack, 0-cost 4{p}/2{d}.
 * Printed: Galvanize — When this defends, you may destroy an item you control.
 * If you do, this gets +2{d}.
 */

describe("Infuse Alloy (EVO120) AAA", () => {
  it("happy: destroying an item you control grants +2{d} while defending", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [infuseAlloyRed],
        arena: [cerebellumProcessorBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(infuseAlloyRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Dash.target(cerebellumProcessorBlue);

    expectFabCard(Dash, cerebellumProcessorBlue).toBeIn("graveyard");
    expectFabCard(Dash, infuseAlloyRed).toHaveDefense(4);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: declining the destroy leaves printed 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [infuseAlloyRed],
        arena: [cerebellumProcessorBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(infuseAlloyRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, cerebellumProcessorBlue).toBeIn("arena");
    expectFabCard(Dash, infuseAlloyRed).toHaveDefense(2);
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("timing: with no item the optional cannot grant +2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [infuseAlloyRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(infuseAlloyRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, infuseAlloyRed).toHaveDefense(2);
    expectFabPlayer(Dash).toHaveLife(18);
  });
});
