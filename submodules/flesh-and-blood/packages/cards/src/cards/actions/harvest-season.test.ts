import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { harvestSeasonRed } from "./harvest-season.ts";

describe("Harvest Season family AAA", () => {
  it("happy: your action-phase start destroys this then you gain 3{h}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: briar,
        arena: [harvestSeasonRed],
        hand: [],
        deck: 6,
      },
    );
    const Briar = game.as(briar);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Briar, harvestSeasonRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveLife(23);
  });

  it("boundary: opponent action-phase start does not destroy this or gain you life", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        arena: [harvestSeasonRed],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Briar = game.as(briar);

    expectFabCard(Briar, harvestSeasonRed).toBeIn("arena");
    expectFabPlayer(Briar).toHaveLife(20);

    Briar.endTurn();
    game.untilIdle();

    expectFabCard(Briar, harvestSeasonRed).toBeIn("arena");
    expectFabPlayer(Briar).toHaveLife(20);
  });

  it("timing: you do not gain 3{h} until your action-phase start", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        arena: [harvestSeasonRed],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Briar = game.as(briar);

    expectFabCard(Briar, harvestSeasonRed).toBeIn("arena");
    expectFabPlayer(Briar).toHaveLife(20);
  });
});
