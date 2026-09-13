import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { nimblismBlue } from "./nimblism.ts";
import { tomeOfTormentRed } from "./tome-of-torment.ts";

describe("Tome of Torment (MON194) AAA", () => {
  it("happy: playing from banished draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        banished: [tomeOfTormentRed],
        hand: [],
        deckTop: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.play(tomeOfTormentRed, { from: "banished" });
    game.helpers.resolveUntilIdle();

    expectFabCard(Levia, tomeOfTormentRed).toBeIn("graveyard");
    expectFabCard(Levia, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Levia).toHaveHandCount(1);
  });

  it("boundary: with 0 action points the Action cannot be played from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        banished: [tomeOfTormentRed],
        hand: [],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    expectFabUnplayable(
      () => Levia.play(tomeOfTormentRed, { from: "banished" }),
      /action-point cost cannot be paid|insufficient_action_points|couldn't be played/i,
    );
    expectFabCard(Levia, tomeOfTormentRed).toBeBanished();
  });

  it("timing: Blood Debt taxes 1 at end of turn while it remains public-banished", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        banished: [tomeOfTormentRed],
        hand: [],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.endTurn();
    game.untilIdle();

    expectFabPlayer(Levia).toHaveLife(19);
    expectFabCard(Levia, tomeOfTormentRed).toBeBanished();
  });
});
