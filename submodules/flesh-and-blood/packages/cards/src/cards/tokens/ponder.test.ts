import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { ponder } from "./ponder.ts";

describe("Ponder (DYN244) AAA", () => {
  it("happy: at the beginning of your end phase this is destroyed and you draw a card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [ponder],
        hand: [],
        deck: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("arena")).not.toContain(ponder.canonicalId);
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
  });

  it("boundary: Ponder does not draw on the opponent's end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [ponder],
        hand: [],
        deck: [nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, ponder).toBeIn("arena");
    // Any cards Bravo holds come only from the CR 4.4.3f turn-1 intellect
    // draw, never from Ponder's triggered ability on the opponent's turn.
    const bravoDraws = game
      .committedEvents()
      .filter((event) => event.name === "draw" && event.data.playerId === Bravo.id);
    for (const draw of bravoDraws) {
      expect(draw.cause).toMatchObject({ rule: "end-phase-draw-to-intellect" });
    }
    expect(Bravo.zone("hand")).toHaveLength(bravoDraws.length);
  });

  it("timing: the draw happens only after the end-phase destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [ponder],
        hand: [],
        deck: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, ponder).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveHandCount(0);
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveHandCount(1);
  });
});
