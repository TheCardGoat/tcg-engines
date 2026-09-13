import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { liquefyRed } from "./liquefy.ts";

/**
 * Liquefy (UPR087) — at chain link 4+, target AAC gains on-hit -1{d} equipment.
 */

describe("Liquefy (UPR087) AAA", () => {
  it("boundary: at chain link 1 a hit does not destroy equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, liquefyRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Fai.must.playReaction(liquefyRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: cannot play without an attack action on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [liquefyRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    expect(() => Fai.must.playReaction(liquefyRed)).toThrow(
      /not legal|no legal target|couldn't be played/i,
    );
  });

  it("boundary: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [liquefyRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Fai.defendWith([liquefyRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveLife(18);
    expect(Fai.zone("graveyard")).toContain(liquefyRed.canonicalId);
  });
});
