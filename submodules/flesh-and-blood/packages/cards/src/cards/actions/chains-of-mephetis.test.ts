import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { chainsOfMephetisBlue } from "./chains-of-mephetis.ts";

describe("Chains of Mephetis (DTD170) AAA", () => {
  it("happy: playing this from banished enters the arena with a doom counter", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        banished: [chainsOfMephetisBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(chainsOfMephetisBlue, { from: "banished" });
    game.untilIdle();

    expectFabCard(Bravo, chainsOfMephetisBlue).toBeIn("arena").toHaveCounters(0, "doom");
  });

  it("boundary: playing this from hand enters without a doom counter", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [chainsOfMephetisBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(chainsOfMephetisBlue);
    game.untilIdle();

    expectFabCard(Bravo, chainsOfMephetisBlue).toBeIn("arena").toHaveCounters(0, "doom");
  });

  it("timing: at the start of your turn this is destroyed unless a doom counter is removed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [chainsOfMephetisBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(chainsOfMephetisBlue);
    game.untilIdle();
    Bravo.endTurn();
    game.as(dash).endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Bravo, chainsOfMephetisBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(20);
  });
});
