import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { timeSkippers } from "./time-skippers.ts";

describe("Time Skippers (MON240) AAA", () => {
  it("happy: pay 3{r} and destroy this to gain 2 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [timeSkippers],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(timeSkippers);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, timeSkippers).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectFabPlayer(Bravo).toHaveAP(2);
  });

  it("boundary: 2 resources cannot pay the Action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [timeSkippers],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).expectActivationRejected(timeSkippers);
    expectFabCard(game.as(bravo), timeSkippers).toBeIn("legs");
  });

  it("timing: an Action activation is illegal at 0 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [timeSkippers],
        hand: [],
        resourcePoints: 3,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).expectActivationRejected(timeSkippers);
    expectFabCard(game.as(bravo), timeSkippers).toBeIn("legs");
  });
});
