import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { nimblismBlue } from "./nimblism.ts";
import { boundingDemigonRed } from "./bounding-demigon.ts";

describe("Bounding Demigon (CHN009) AAA", () => {
  it("happy: after a non-attack action, playing from banished is +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [nimblismBlue],
        banished: [boundingDemigonRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Chane.playAttack(boundingDemigonRed, { from: "banished" });

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: without a non-attack action this turn, banished play is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [boundingDemigonRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    expectFabUnplayable(
      () => Chane.playAttack(boundingDemigonRed, { from: "banished" }),
      /play condition is not satisfied|couldn't be played/i,
    );
    expectFabCard(Chane, boundingDemigonRed).toBeBanished();
  });

  it("timing: Blood Debt taxes 1 at end of turn while it remains public-banished", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        banished: [boundingDemigonRed],
        hand: [],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.endTurn();
    game.untilIdle();

    expectFabPlayer(Chane).toHaveLife(19);
    expectFabCard(Chane, boundingDemigonRed).toBeBanished();
  });
});
