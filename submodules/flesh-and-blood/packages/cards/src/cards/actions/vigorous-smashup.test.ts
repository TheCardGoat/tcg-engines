import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { nimblismBlue } from "./nimblism.ts";
import { vigorousSmashupRed } from "./vigorous-smashup.ts";

describe("Vigorous Smashup (SUP164) AAA", () => {
  it("happy: defending and winning the clash creates a Vigor token", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: rhinar,
        hand: [vigorousSmashupRed],
        deck: [commandAndConquerRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).playAttack(brutalAssaultBlue);
    Rhinar.defendWith(vigorousSmashupRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("vigor", 0);
  });

  it("boundary: losing the clash gives the attacking hero the Vigor token", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [commandAndConquerRed],
      },
      {
        hero: rhinar,
        hand: [vigorousSmashupRed],
        deck: [nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).playAttack(brutalAssaultBlue);
    Rhinar.defendWith(vigorousSmashupRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(game.as(dash)).toHaveTokenCount("vigor", 1);
    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 0);
    expectFabCard(Rhinar, vigorousSmashupRed).toBeIn("graveyard");
  });
});
