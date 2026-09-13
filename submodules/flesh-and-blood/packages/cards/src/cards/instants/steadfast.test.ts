import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { flashBoltRed } from "./flash-bolt.ts";
import { cranialCrushBlue } from "../actions/cranial-crush.ts";
import { snatchRed } from "../actions/snatch.ts";
import { steadfastBlue } from "./steadfast.ts";

describe("Steadfast family AAA", () => {
  it("happy: the blue printing prevents 4 from the chosen source's attack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cranialCrushBlue], resourcePoints: 6, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [steadfastBlue], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(cranialCrushBlue);
    game.toReaction();
    game.helpers.passPriorityTo(Dash);
    Dash.play(steadfastBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, steadfastBlue).toBeIn("graveyard");
  });

  it("boundary: damage from outside the combat chain is not covered", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, flashBoltRed], resourcePoints: 2, actionPoints: 2, deck: 6 },
      { hero: dash, life: 20, hand: [steadfastBlue], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.toReaction();
    game.helpers.passPriorityTo(Dash);
    Dash.play(steadfastBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20);

    Bravo.play(flashBoltRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(17);
  });
});
