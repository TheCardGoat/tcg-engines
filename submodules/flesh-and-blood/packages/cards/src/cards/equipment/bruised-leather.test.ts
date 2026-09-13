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
import { bruisedLeather } from "./bruised-leather.ts";

describe("Bruised Leather (ROS213) AAA", () => {
  it("happy: after being dealt damage, Instant destroy prevents the next 1", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { hero: dash, life: 20, chest: [bruisedLeather], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);

    game.as(bravo).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(bravo).pass();
    Dash.activate(bruisedLeather);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, bruisedLeather).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("boundary: cannot activate before being dealt damage this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, chest: [bruisedLeather], actionPoints: 1, hand: [], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(bruisedLeather);
    expectFabCard(Dash, bruisedLeather).toBeIn("chest");
  });

  it("timing: unused leather stays equipped through the end of turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, chest: [bruisedLeather], hand: [], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, bruisedLeather).toBeIn("chest");
  });
});
