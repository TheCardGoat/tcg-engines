import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { zen } from "../heroes/zen.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { pathWellTraveledBlue } from "./path-well-traveled.ts";

/**
 * Path Well Traveled (MST098) — target attack gets go again.
 */

describe("Path Well Traveled (MST098) AAA", () => {
  it("happy: target attack gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [snatchRed, pathWellTraveledBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Zen.must.playInstant(pathWellTraveledBlue);
    game.passBoth();
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveAP(1);
  });

  it("boundary: cannot play without an attack on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [pathWellTraveledBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);
    expectFabUnplayable(() => Zen.must.playInstant(pathWellTraveledBlue));
  });

  it("timing: go again refunds after the targeted attack resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [snatchRed, pathWellTraveledBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Zen.must.playInstant(pathWellTraveledBlue);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Zen).toHaveAP(1);
  });
});
