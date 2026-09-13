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
import { crackerBaubleYellow } from "./cracker-bauble.ts";

describe("Cracker Bauble (LGS360) AAA", () => {
  it("happy: pitches for 2 resources", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimbleStrikeRed, crackerBaubleYellow],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(nimbleStrikeRed, { pitch: [crackerBaubleYellow] });

    expectFabCard(Dash, crackerBaubleYellow).toBeIn("pitch");
    expectFabPlayer(Dash).toHaveResourceCount(1);
  });

  it("boundary: cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [crackerBaubleYellow], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).play(crackerBaubleYellow)).toThrow();
    expectFabCard(game.as(dash), crackerBaubleYellow).toBeIn("hand");
  });

  it("timing: pitching this creates no arena token", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimbleStrikeRed, crackerBaubleYellow],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(nimbleStrikeRed, { pitch: [crackerBaubleYellow] });
    game.passBoth();

    expectFabCard(Dash, crackerBaubleYellow).toBeIn("pitch");
    expect(Dash.zone("arena")).toHaveLength(0);
  });
});
