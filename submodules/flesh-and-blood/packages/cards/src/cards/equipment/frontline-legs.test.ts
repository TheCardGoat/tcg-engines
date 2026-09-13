import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { frontlineLegs } from "./frontline-legs.ts";

describe("Frontline Legs (DTD225) AAA", () => {
  it("happy: at the beginning of your end phase this gets a -1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [frontlineLegs], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, frontlineLegs).toBeIn("legs");
    expectFabCard(Bravo, frontlineLegs).toHaveDefenseCounters(-1);
    expectFabCard(Bravo, frontlineLegs).toHaveKeyword("blade-break");
  });

  it("boundary: the opponent's end phase does not put a -1{d} counter on this", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      { hero: bravo, legs: [frontlineLegs], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, frontlineLegs).toBeIn("legs");
    expectFabCard(Bravo, frontlineLegs).toHaveDefenseCounters(0);
  });

  it("timing: Blade Break destroys the legs after they defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, legs: [frontlineLegs], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(frontlineLegs);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, frontlineLegs).toBeIn("graveyard");
  });
});
