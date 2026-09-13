import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { dimenxxionalVortex } from "./dimenxxional-vortex.ts";

describe("Dimenxxional Vortex (DTD171) AAA", () => {
  it("happy: each hero banishes a card from their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [dimenxxionalVortex],
        arsenal: [nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [snatchRed], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.play(dimenxxionalVortex);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Levia, nimblismBlue).toBeBanished();
    expectFabCard(Dash, snatchRed).toBeBanished();
    expectFabCard(Levia, dimenxxionalVortex).toBeIn("graveyard");
  });

  it("boundary: from hand it still costs 3 and empty arsenals stay empty", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [dimenxxionalVortex],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.play(dimenxxionalVortex);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expect(Levia.zone("arsenal")).toHaveLength(0);
    expect(Dash.zone("arsenal")).toHaveLength(0);
  });

  it("timing: Blood Debt taxes 1 at end of turn while it remains public-banished", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        banished: [dimenxxionalVortex],
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
    expectFabCard(Levia, dimenxxionalVortex).toBeBanished();
  });
});
