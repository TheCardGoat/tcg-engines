import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { restlessMagisterRed } from "./restless-magister.ts";
import { bridgeOfDamnationBlue } from "./bridge-of-damnation.ts";

describe("Bridge of Damnation (IAR058) AAA", () => {
  it("happy: playing this refunds the action point (go again)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bridgeOfDamnationBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(bridgeOfDamnationBlue);
    game.untilIdle();

    expectFabCard(Bravo, bridgeOfDamnationBlue).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: with no zombie in banished, start of turn destroys this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bridgeOfDamnationBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(bridgeOfDamnationBlue);
    game.untilIdle();
    Bravo.endTurn();
    game.as(dash).endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Bravo, bridgeOfDamnationBlue).toBeIn("graveyard");
  });

  it("timing: putting a banished zombie into the graveyard keeps this at start of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bridgeOfDamnationBlue],
        banished: [restlessMagisterRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(bridgeOfDamnationBlue);
    game.untilIdle();
    Bravo.endTurn();
    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Bravo, bridgeOfDamnationBlue).toBeIn("arena");
    expectFabCard(Bravo, restlessMagisterRed).toBeIn("graveyard");
  });
});
