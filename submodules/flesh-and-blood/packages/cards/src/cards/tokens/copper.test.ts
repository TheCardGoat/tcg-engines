import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { copper } from "./copper.ts";

describe("Copper (CRU197) AAA", () => {
  it("happy: pay 4{r} and destroy this to draw a card and keep the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [copper],
        hand: [],
        resourcePoints: 4,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(copper);
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("arena")).not.toContain(copper.canonicalId);
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveResourceCount(0).toHaveAP(1);
  });

  it("boundary: 0 action points cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [copper],
        resourcePoints: 4,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );

    game.as(bravo).expectActivationRejected(copper);
    expectFabCard(game.as(bravo), copper).toBeIn("arena");
  });

  it("timing: 0{r} cannot pay the destroy-and-draw Action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [copper],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: dash, deck: 6 },
    );

    game.as(bravo).expectActivationRejected(copper);
    expectFabCard(game.as(bravo), copper).toBeIn("arena");
    expect(game.as(bravo).zone("hand")).toHaveLength(0);
  });
});
