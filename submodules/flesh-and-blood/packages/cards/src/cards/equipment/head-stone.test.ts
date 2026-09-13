import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { snatchYellow, snatchRed } from "../actions/snatch.ts";
import { browbeatBlue } from "../actions/browbeat.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { plunderRunRed } from "../actions/plunder-run.ts";
import { headStone } from "./head-stone.ts";

/**
 * Head Stone — Necromancer Equipment - Head, d1 Battleworn.
 *
 * Printed: "Instant - Destroy this: Destroy the top card of your deck."
 */

describe("Head Stone (SEA081) AAA", () => {
  it("happy: destroy this to mill the top card of your own deck", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        head: [headStone],
        hand: [],
        deckTop: [snatchYellow],
        deck: 6,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(headStone);
    game.helpers.resolveUntilIdle();

    expectFabCard(Gravy, headStone).toBeIn("graveyard");
    expectFabCard(Gravy, snatchYellow).toBeIn("graveyard");
  });

  it("timing: the Instant can be activated on the opponent's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        head: [headStone],
        hand: [snatchRed, snatchYellow, browbeatBlue, nimblismBlue],
        deckTop: [plunderRunRed],
        deck: 6,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    // A full hand means the end phase draws nothing: Plunder Run stays on top.
    Gravy.endTurn();
    // Dash passes the action phase's first window; the Necromancer answers
    // with the Instant before the turn can move on.
    game.helpers.passPriorityTo(Gravy);

    Gravy.activate(headStone);
    game.helpers.resolveUntilIdle();

    expectFabCard(Gravy, headStone).toBeIn("graveyard");
    expectFabCard(Gravy, plunderRunRed).toBeIn("graveyard");
  });
});
