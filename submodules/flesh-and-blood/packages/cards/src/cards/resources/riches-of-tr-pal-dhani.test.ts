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
import { richesOfTrPalDhaniYellow } from "./riches-of-tr-pal-dhani.ts";

describe("Riches of Trōpal-Dhani (SEA000) AAA", () => {
  it("happy: pitches for 2 resources and creates a Gold token", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimbleStrikeRed, richesOfTrPalDhaniYellow],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(nimbleStrikeRed, { pitch: [richesOfTrPalDhaniYellow] });
    game.passBoth();

    expectFabCard(Dash, richesOfTrPalDhaniYellow).toBeIn("pitch");
    expectFabPlayer(Dash).toHaveResourceCount(1);
    expect(Dash.zone("arena")).toContain("token:gold");
  });

  it("boundary: cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [richesOfTrPalDhaniYellow], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).play(richesOfTrPalDhaniYellow)).toThrow();
    expectFabCard(game.as(dash), richesOfTrPalDhaniYellow).toBeIn("hand");
  });
});
