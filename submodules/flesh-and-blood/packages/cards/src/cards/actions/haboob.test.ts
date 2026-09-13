import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { ash } from "../tokens/ash.ts";
import { snatchRed } from "./snatch.ts";
import { haboobRed } from "./haboob.ts";

describe("Haboob (PEN249) AAA", () => {
  it("happy: start-of-turn storm counter then destroying Ash keeps this in arena", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [haboobRed, ash],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Bravo, haboobRed).toBeIn("arena");
    expectFabCard(Bravo, haboobRed).toHaveCounters(1, "storm");
    expect(Bravo.zone("arena")).not.toContain("token:ash");
  });

  it("boundary: no Ash to destroy puts this in the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [haboobRed],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Bravo, haboobRed).toBeIn("graveyard");
  });

  it("timing: attack action cards get -1{p} while attacking while this is in arena", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [haboobRed],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(3);
  });
});
