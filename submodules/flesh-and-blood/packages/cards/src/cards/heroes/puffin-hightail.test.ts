import { describe, it } from "vitest";
import {
  expectFabPlayer,
  expectFabToken,
  fabToken,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { grindingGearsBlue } from "../actions/grinding-gears.ts";
import { puffinHightail } from "./puffin-hightail.ts";

/**
 * Puffin, Hightail (SEA001) — Pirate Mechanologist Hero — 40hp.
 *
 * Printed: "Action — {t}, destroy a Gold you control: Create a Golden Cog
 * token. The second time you crank each turn, draw a card."
 */

describe("Puffin, Hightail (SEA001) AAA", () => {
  it("happy: tapping and destroying a Gold creates a Golden Cog", () => {
    const game = FabTestEngine.start(
      {
        hero: puffinHightail,
        arena: [fabToken("gold")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Puffin = game.as(puffinHightail);

    Puffin.activate(puffinHightail);
    game.passBoth();

    expectFabToken(game, "gold").toHaveCount(0);
    expectFabToken(game, "golden-cog").toHaveCount(1).toBeIn("arena");
  });

  it("boundary: the first crank of the turn does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: puffinHightail,
        hand: [grindingGearsBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Puffin = game.as(puffinHightail);

    Puffin.play(grindingGearsBlue);

    expectFabPlayer(Puffin).toHaveHandCount(0);
  });

  it("timing: the second crank each turn draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: puffinHightail,
        hand: [grindingGearsBlue, grindingGearsBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Puffin = game.as(puffinHightail);

    // First crank: no draw — only the played card left the hand.
    Puffin.play(grindingGearsBlue);
    expectFabPlayer(Puffin).toHaveHandCount(1);

    // Second crank: the ordinal-2 trigger draws a card.
    Puffin.play(grindingGearsBlue);
    expectFabPlayer(Puffin).toHaveHandCount(1);
  });
});
