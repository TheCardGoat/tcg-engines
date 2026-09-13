import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { hungeringDemigonYellow } from "../actions/hungering-demigon.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { circletOfEternalEnd } from "./circlet-of-eternal-end.ts";

describe("Circlet of Eternal End (IAR223) AAA", () => {
  it("happy: when this defends, turn a card in the attacking hero's banished face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        banished: [hungeringDemigonYellow],
        deck: 6,
      },
      { hero: bravo, life: 20, head: [circletOfEternalEnd], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(circletOfEternalEnd);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(game.as(dash), hungeringDemigonYellow).toBeFaceDown();
    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, circletOfEternalEnd).toBeIn("graveyard");
  });

  it("boundary: empty attacker banished still Blade Breaks after defending", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, banished: [], deck: 6 },
      { hero: bravo, life: 20, head: [circletOfEternalEnd], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(circletOfEternalEnd);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, circletOfEternalEnd).toBeIn("graveyard");
  });

  it("timing: another card defending alone does not fire this or Blade Break", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        banished: [hungeringDemigonYellow],
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        head: [circletOfEternalEnd],
        hand: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(game.as(dash), hungeringDemigonYellow).toBeIn("banished");
    expectFabCard(Bravo, circletOfEternalEnd).toBeIn("head");
    expectFabCard(Bravo, circletOfEternalEnd).toHaveKeyword("blade-break");
  });
});
