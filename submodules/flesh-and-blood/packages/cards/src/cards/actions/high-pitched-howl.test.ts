import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { alphaRampageRed } from "./alpha-rampage.ts";
import { nimblismBlue } from "./nimblism.ts";
import { highPitchedHowlRed } from "./high-pitched-howl.ts";

/**
 * High-Pitched Howl (SUP155) — When this attacks, if there is a card with 6 or more {p} in your pitch zone, create a Vigor token.
 */

describe("High-Pitched Howl (SUP155) AAA", () => {
  it("happy: a 6+{p} card in pitch creates a Vigor token", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [highPitchedHowlRed],
        pitch: [alphaRampageRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(highPitchedHowlRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("vigor", 0);
  });

  it("boundary: a sub-6{p} pitch card creates no Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [highPitchedHowlRed],
        pitch: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(highPitchedHowlRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 0);
  });

  it("timing: Vigor exists at on-attack", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [highPitchedHowlRed],
        pitch: [alphaRampageRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(highPitchedHowlRed, { stopAt: "on-attack" });
    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 1);
  });
});
