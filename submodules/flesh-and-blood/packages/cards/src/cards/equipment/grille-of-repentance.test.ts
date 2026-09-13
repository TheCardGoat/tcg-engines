import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { hungeringDemigonYellow } from "../actions/hungering-demigon.ts";
import { snatchRed } from "../actions/snatch.ts";
import { grilleOfRepentance } from "./grille-of-repentance.ts";

describe("Grille of Repentance (IAR161) AAA", () => {
  it("happy: destroy this, turn your blood-debt banished card face-down, and skip the end-phase tax", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        head: [grilleOfRepentance],
        banished: [hungeringDemigonYellow],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(grilleOfRepentance);

    expectFabCard(Bravo, grilleOfRepentance).toBeIn("graveyard");
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
        head: [grilleOfRepentance],
        banished: [hungeringDemigonYellow],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();

    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabCard(Bravo, grilleOfRepentance).toBeIn("head");
    expectFabCard(Bravo, hungeringDemigonYellow).toBeIn("banished");
  });

  it("timing: Instant is illegal with no blood-debt card in your banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        head: [grilleOfRepentance],
        banished: [snatchRed],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(grilleOfRepentance);
    expectFabCard(Bravo, grilleOfRepentance).toBeIn("head");
    expectFabCard(Bravo, snatchRed).toBeIn("banished");
  });
});
