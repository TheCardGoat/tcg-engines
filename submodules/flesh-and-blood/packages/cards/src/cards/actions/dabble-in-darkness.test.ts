import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { dabbleInDarknessRed } from "./dabble-in-darkness.ts";

describe("Dabble in Darkness (DTD169) AAA", () => {
  it("happy: banishes the top card and this gets -X{p} equal to that pitch", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [dabbleInDarknessRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.playAttack(dabbleInDarknessRed);
    expectFabCard(Levia, nimblismBlue).toBeBanished();
    expectCombat(game).toHaveAttackPower(2);
  });

  it("boundary: a pitch-1 banish subtracts only 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [dabbleInDarknessRed],
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.playAttack(dabbleInDarknessRed);
    expectFabCard(Levia, snatchRed).toBeBanished();
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: blood debt in banished ticks 1 life at the beginning of the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [dabbleInDarknessRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );

    game.as(levia).endTurn();
    expectFabPlayer(game.as(levia)).toHaveLife(19);
  });
});
