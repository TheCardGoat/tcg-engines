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
import { hoodOfSecondThoughts } from "./hood-of-second-thoughts.ts";

describe("Hood of Second Thoughts (ROS212) AAA", () => {
  it("happy: after being dealt damage, Instant destroy prevents the next 1", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { hero: dash, life: 20, head: [hoodOfSecondThoughts], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);

    game.as(bravo).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(bravo).pass();
    Dash.activate(hoodOfSecondThoughts);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, hoodOfSecondThoughts).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("boundary: cannot activate before being dealt damage this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, head: [hoodOfSecondThoughts], actionPoints: 1, hand: [], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(hoodOfSecondThoughts);
    expectFabCard(Dash, hoodOfSecondThoughts).toBeIn("head");
  });

  it("timing: unused hood stays equipped through the end of turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, head: [hoodOfSecondThoughts], hand: [], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, hoodOfSecondThoughts).toBeIn("head");
  });
});
