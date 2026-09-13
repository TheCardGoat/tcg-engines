import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { disableRed } from "./disable.ts";
import { nimblismBlue } from "./nimblism.ts";
import { familiarStoryRed } from "./familiar-story.ts";

describe("Familiar Story (SUP185) AAA", () => {
  it("happy: a Guardian card defending this creates Confidence for the attacking hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [familiarStoryRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [disableRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(familiarStoryRed);
    game.as(dash).defendWith(disableRed);
    game.passBoth();

    expectFabPlayer(Bravo).toHaveTokenCount("confidence", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("confidence", 0);
  });

  it("boundary: a non-Guardian defender creates no Confidence", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [familiarStoryRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(familiarStoryRed);
    game.as(dash).defendWith(nimblismBlue);
    game.passBoth();

    expectFabPlayer(Bravo).toHaveTokenCount("confidence", 0);
  });
});
