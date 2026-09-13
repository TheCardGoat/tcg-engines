import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { cerebellumProcessorBlue } from "../actions/cerebellum-processor.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { cognitionFieldRed } from "./cognition-field.ts";

/**
 * Cognition Field, Red (EVO117) — Mechanologist Block, 3{d}.
 * Printed: Galvanize — When this defends, you may destroy an item you control.
 * If you do, this gets +2{d}.
 */

describe("Cognition Field (EVO117) AAA", () => {
  it("happy: destroying an item you control grants +2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [cognitionFieldRed],
        arena: [cerebellumProcessorBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(cognitionFieldRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Dash.target(cerebellumProcessorBlue);

    expectFabCard(Dash, cerebellumProcessorBlue).toBeIn("graveyard");
    expectFabCard(Dash, cognitionFieldRed).toHaveDefense(5);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: declining the destroy leaves printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [cognitionFieldRed],
        arena: [cerebellumProcessorBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(cognitionFieldRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, cerebellumProcessorBlue).toBeIn("arena");
    expectFabCard(Dash, cognitionFieldRed).toHaveDefense(3);
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("timing: with no item the optional cannot grant +2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [cognitionFieldRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(cognitionFieldRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, cognitionFieldRed).toHaveDefense(3);
    expectFabPlayer(Dash).toHaveLife(19);
  });
});
