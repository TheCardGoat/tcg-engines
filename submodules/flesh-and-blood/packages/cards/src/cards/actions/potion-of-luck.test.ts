import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { potionOfLuckBlue } from "./potion-of-luck.ts";

describe("Potion of Luck (EVR187) AAA", () => {
  it("happy: destroy this, shuffle hand and arsenal into the deck, then draw that many", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [potionOfLuckBlue],
        hand: [snatchRed, nimblismBlue],
        arsenal: [nimblismBlue],
        actionPoints: 1,
        deck: 8,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(potionOfLuckBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, potionOfLuckBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(3);
    expect(Dash.zone("arsenal")).toHaveLength(0);
  });

  it("boundary: the Instant cannot activate from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [potionOfLuckBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(potionOfLuckBlue);
    expectFabCard(Dash, potionOfLuckBlue).toBeIn("hand");
  });

  it("timing: Instant activation does not spend an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [potionOfLuckBlue],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(potionOfLuckBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveAP(1);
    expectFabPlayer(Dash).toHaveHandCount(1);
  });
});
