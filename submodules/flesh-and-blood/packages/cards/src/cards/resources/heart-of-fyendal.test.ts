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
import { heartOfFyendalBlue } from "./heart-of-fyendal.ts";

describe("Heart of Fyendal (WTR000) AAA", () => {
  it("happy: pitches for 3 resources and gains 1{h} when behind", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimbleStrikeRed, heartOfFyendalBlue],
        resourcePoints: 0,
        life: 10,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(nimbleStrikeRed, { pitch: [heartOfFyendalBlue] });
    game.passBoth();

    expectFabCard(Dash, heartOfFyendalBlue).toBeIn("pitch");
    expectFabPlayer(Dash).toHaveResourceCount(2);
    expectFabPlayer(Dash).toHaveLife(11);
  });

  it("boundary: cannot be played, and pitching while ahead does not gain life", () => {
    const playGame = FabTestEngine.start(
      { hero: dash, hand: [heartOfFyendalBlue], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expect(() => playGame.as(dash).play(heartOfFyendalBlue)).toThrow();
    expectFabCard(playGame.as(dash), heartOfFyendalBlue).toBeIn("hand");

    const ahead = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimbleStrikeRed, heartOfFyendalBlue],
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      { hero: bravo, life: 10, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = ahead.as(dash);
    Dash.play(nimbleStrikeRed, { pitch: [heartOfFyendalBlue] });
    ahead.passBoth();
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
