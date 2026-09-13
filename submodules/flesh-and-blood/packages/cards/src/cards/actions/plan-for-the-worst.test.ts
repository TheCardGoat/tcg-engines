import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { planForTheWorstBlue } from "./plan-for-the-worst.ts";

/**
 * Plan for the Worst (ROS247) — Ranger Action.
 *
 * Printed: Look at target hero's hand and arsenal. At the beginning of their
 * next end phase, they discard all cards in their hand and destroy all cards
 * in their arsenal.
 *
 * Follow-up is a resolution delayed-trigger (source-static dies in GY). Stone
 * Rain's window is `during-their-next-end-phase` `matching:first`. Drive is
 * controller `endTurn` then their `endTurn` then `untilIdle` — end-phase
 * draw-to-intellect happens after the beginning-of-end-phase discard, so the
 * proof is the original cards in GY, not hand count 0.
 */

describe("Plan for the Worst (ROS247) AAA", () => {
  it("happy: the looked-at hero discards hand and loses arsenal at their next end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [planForTheWorstBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed, nimblismBlue],
        arsenal: [{ card: brutalAssaultBlue, state: { faceDown: true } }],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(planForTheWorstBlue, { target: Dash });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("arsenal");

    Azalea.endTurn();
    Dash.endTurn();
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
  });

  it("boundary: the controller's own end phase does not empty the opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [planForTheWorstBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed],
        arsenal: [{ card: brutalAssaultBlue, state: { faceDown: true } }],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(planForTheWorstBlue, { target: Dash });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });
    Azalea.endTurn();

    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("arsenal");
  });
});
