import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { gold } from "./gold.ts";

describe("Gold (DYN243) AAA", () => {
  it("happy: pay 2{r} and destroy this to draw a card and keep the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [gold],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(gold);
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("arena")).not.toContain(gold.canonicalId);
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveResourceCount(0).toHaveAP(1);
  });

  it("boundary: 0 action points cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [gold],
        resourcePoints: 2,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );

    game.as(bravo).expectActivationRejected(gold);
    expectFabCard(game.as(bravo), gold).toBeIn("arena");
  });

  it("timing: 0{r} cannot pay the destroy-and-draw Action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [gold],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: dash, deck: 6 },
    );

    game.as(bravo).expectActivationRejected(gold);
    expectFabCard(game.as(bravo), gold).toBeIn("arena");
    expect(game.as(bravo).zone("hand")).toHaveLength(0);
  });
});
