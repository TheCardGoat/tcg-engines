import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { hungeringDemigonYellow } from "../actions/hungering-demigon.ts";
import { snatchRed } from "../actions/snatch.ts";
import { pathOfRepentance } from "./path-of-repentance.ts";

describe("Path of Repentance (IAR163) AAA", () => {
  it("happy: destroy this, turn your blood-debt banished card face-down, and skip the end-phase tax", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        legs: [pathOfRepentance],
        banished: [hungeringDemigonYellow],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(pathOfRepentance);

    expectFabCard(Bravo, pathOfRepentance).toBeIn("graveyard");
    expectFabCard(Bravo, hungeringDemigonYellow).toBeFaceDown();

    Bravo.endTurn();
    // CR 8.3.11a: face-down (private) blood debt does not lose life.
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: a public blood-debt card still loses 1 life at the end phase if this is not activated", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        legs: [pathOfRepentance],
        banished: [hungeringDemigonYellow],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();

    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabCard(Bravo, pathOfRepentance).toBeIn("legs");
    expectFabCard(Bravo, hungeringDemigonYellow).toBeIn("banished");
  });

  it("boundary: lethal Blood Debt at 1 life ends the game", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 1,
        legs: [pathOfRepentance],
        banished: [hungeringDemigonYellow],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();

    expect(game.hasGameEnded()).toBe(true);
    expectFabPlayer(Bravo).toHaveLife(0);
  });

  it("timing: Instant is illegal with no blood-debt card in your banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        legs: [pathOfRepentance],
        banished: [snatchRed],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(pathOfRepentance);
    expectFabCard(Bravo, pathOfRepentance).toBeIn("legs");
    expectFabCard(Bravo, snatchRed).toBeIn("banished");
  });
});
