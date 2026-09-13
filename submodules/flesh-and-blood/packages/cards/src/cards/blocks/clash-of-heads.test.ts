import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { disableRed } from "../actions/disable.ts";
import { helmOfIsenSPeak } from "../equipment/helm-of-isen-s-peak.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { clashOfHeadsYellow } from "./clash-of-heads.ts";

/**
 * Clash of Heads (MPG047) — Guardian Block, 4{d}.
 *
 * Printed: When this defends a Guardian attack, clash with the attacking
 * hero. If there is a winner, the other hero puts a -1{d} counter on a head
 * they have equipped. If they don't, they lose 1{h}.
 */

describe("Clash of Heads (MPG047) AAA", () => {
  it("happy: clash loser without a Head loses 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [disableRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: dash,
        hand: [clashOfHeadsYellow],
        deck: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );

    game.as(bravo).playAttack(disableRed);
    game.as(dash).defendWith(clashOfHeadsYellow);
    game.passBoth();

    expectFabPlayer(game.as(bravo)).toHaveLife(19);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabCard(game.as(dash), clashOfHeadsYellow).toBeIn("combatChain");
  });

  it("boundary: defending a non-Guardian attack does not clash", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: bravo,
        hand: [clashOfHeadsYellow],
        head: [helmOfIsenSPeak],
        deck: [nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );

    game.as(dash).playAttack(snatchRed);
    game.as(bravo).defendWith(clashOfHeadsYellow);
    expectFabCard(game.as(bravo), clashOfHeadsYellow).toBeIn("combatChain");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabPlayer(game.as(bravo)).toHaveLife(20);
  });

  it("timing: clash loser with a Head puts a -1{d} counter instead of losing {h}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [disableRed],
        head: [helmOfIsenSPeak],
        resourcePoints: 5,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: dash,
        hand: [clashOfHeadsYellow],
        deck: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );

    game.as(bravo).playAttack(disableRed);
    game.as(dash).defendWith(clashOfHeadsYellow);
    game.passBoth();

    expectFabPlayer(game.as(bravo)).toHaveLife(20);
    expectFabCard(game.as(bravo), helmOfIsenSPeak).toHaveDefense(0);
  });
});
