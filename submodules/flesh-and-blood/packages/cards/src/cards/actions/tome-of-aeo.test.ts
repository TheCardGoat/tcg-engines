import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { nimblismBlue } from "./nimblism.ts";
import { tomeOfAeoBlue } from "./tome-of-aeo.ts";

describe("Tome of Aeo (DYN217) AAA", () => {
  it("happy: your action-phase start destroys this then draws a card", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: prism,
        arena: [tomeOfAeoBlue],
        hand: [],
        deck: 6,
        deckTop: [nimblismBlue],
      },
    );
    const Prism = game.as(prism);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Prism, tomeOfAeoBlue).toBeIn("graveyard");
    expectFabCard(Prism, nimblismBlue).toBeIn("hand");
  });

  it("boundary: opponent action-phase start does not destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [tomeOfAeoBlue],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Prism = game.as(prism);

    Prism.endTurn();
    game.untilIdle();

    expectFabCard(Prism, tomeOfAeoBlue).toBeIn("arena");
  });

  it("timing: the extra draw is only on your action-phase start", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [tomeOfAeoBlue],
        hand: [],
        deck: 6,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Prism = game.as(prism);

    Prism.endTurn();
    game.untilIdle();
    expectFabCard(Prism, tomeOfAeoBlue).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Prism, tomeOfAeoBlue).toBeIn("graveyard");
    expectFabCard(Prism, nimblismBlue).toBeIn("hand");
  });
});
