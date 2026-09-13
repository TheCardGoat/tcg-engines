import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { potionOfDJVuBlue } from "./potion-of-d-j-vu.ts";

describe("Potion of Déjà Vu (EVR185) AAA", () => {
  it("happy: Instant destroy this puts pitched cards on top of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [potionOfDJVuBlue],
        hand: [],
        pitch: [nimblismBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(potionOfDJVuBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, potionOfDJVuBlue).toBeIn("graveyard");
    expect(Dash.zone("pitch")).toHaveLength(0);
    expect(new Set(Dash.zone("deck").slice(-2))).toEqual(
      new Set([nimblismBlue.canonicalId, snatchRed.canonicalId]),
    );
  });

  it("boundary: empty pitch is a no-op besides destroying the potion", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [potionOfDJVuBlue],
        hand: [],
        pitch: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(potionOfDJVuBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, potionOfDJVuBlue).toBeIn("graveyard");
    expect(Dash.zone("pitch")).toHaveLength(0);
    expect(Dash.zone("deck")).toHaveLength(6);
  });

  it("timing: Instant activation does not spend an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [potionOfDJVuBlue],
        hand: [],
        pitch: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(potionOfDJVuBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveAP(1);
  });
});
