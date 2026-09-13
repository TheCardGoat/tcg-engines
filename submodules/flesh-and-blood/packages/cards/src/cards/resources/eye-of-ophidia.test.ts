import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimbleStrikeRed } from "../actions/nimble-strike.ts";
import { eyeOfOphidiaBlue } from "./eye-of-ophidia.ts";

describe("Eye of Ophidia (ARC000) AAA", () => {
  it("happy: pitches for 3 resources and presents opt 2", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [nimbleStrikeRed, eyeOfOphidiaBlue], resourcePoints: 0, deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(nimbleStrikeRed, { pitch: [eyeOfOphidiaBlue] });

    expectFabCard(Dash, eyeOfOphidiaBlue).toBeIn("pitch");
    expectFabPlayer(Dash).toHaveResourceCount(2);
  });

  it("boundary: cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [eyeOfOphidiaBlue], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).play(eyeOfOphidiaBlue)).toThrow();
    expectFabCard(game.as(dash), eyeOfOphidiaBlue).toBeIn("hand");
  });
});
