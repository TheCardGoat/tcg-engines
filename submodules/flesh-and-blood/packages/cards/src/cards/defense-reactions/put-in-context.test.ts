import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimbleStrikeYellow } from "../actions/nimble-strike.ts";
import { snatchRed } from "../actions/snatch.ts";
import { putInContextBlue } from "./put-in-context.ts";

describe("Put in Context (CIN027) AAA", () => {
  it("happy: can defend an attack with 3 or less base {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimbleStrikeYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [putInContextBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(nimbleStrikeYellow);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Bravo.play(putInContextBlue);
    game.passBoth();

    expectFabCard(Bravo, putInContextBlue).toHaveDefense(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: cannot defend an attack with more than 3 base {p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [putInContextBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    expectFabUnplayable(() => Bravo.play(putInContextBlue), /3 or less base/i);
    expectFabCard(Bravo, putInContextBlue).toBeIn("hand");
  });

  it("timing: cannot play this during the defend step or outside combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [putInContextBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    // Bravo holds priority in his own action phase, far from any reaction
    // step a defense reaction requires.
    expectFabUnplayable(
      () => Bravo.play(putInContextBlue),
      /3 or less base|not legal in the current reaction step/i,
    );
    expectFabCard(Bravo, putInContextBlue).toBeIn("hand");
  });
});
