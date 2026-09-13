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
import { voltarisBlue } from "./voltaris.ts";

describe("Voltaris (OMN000) AAA", () => {
  it("happy: pitches for 3 resources and creates a Lightning Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimbleStrikeRed, voltarisBlue],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(nimbleStrikeRed, { pitch: [voltarisBlue] });
    game.passBoth();

    expectFabCard(Dash, voltarisBlue).toBeIn("pitch");
    expectFabPlayer(Dash).toHaveResourceCount(2);
    expect(Dash.zone("arena")).toContain("token:lightning-flow");
  });

  it("boundary: cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [voltarisBlue], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).play(voltarisBlue)).toThrow();
    expectFabCard(game.as(dash), voltarisBlue).toBeIn("hand");
  });

  it("timing: the Lightning Flow is created for the pitching hero, not the opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimbleStrikeRed, voltarisBlue],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(nimbleStrikeRed, { pitch: [voltarisBlue] });
    game.passBoth();

    expect(Dash.zone("arena")).toContain("token:lightning-flow");
    expect(game.as(bravo).zone("arena")).not.toContain("token:lightning-flow");
  });
});
