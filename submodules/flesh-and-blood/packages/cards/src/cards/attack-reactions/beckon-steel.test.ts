import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnbladeResplendent } from "../weapons/dawnblade-resplendent.ts";
import { snatchRed } from "../actions/snatch.ts";
import { beckonSteelBlue } from "./beckon-steel.ts";

/**
 * Beckon Steel (OMN238) — target sword attack gains on-hit sharpen.
 */

describe("Beckon Steel (OMN238) AAA", () => {
  it("happy: target sword attack can receive the on-hit grant", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        hand: [beckonSteelBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("reaction");
    Dori.must.playReaction(beckonSteelBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("boundary: an attack action is not a legal sword-attack target", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [snatchRed, beckonSteelBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expect(() => Dori.must.playReaction(beckonSteelBlue)).toThrow(
      /no legal target|couldn't be played|not legal/i,
    );
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [beckonSteelBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dori.defendWith([beckonSteelBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dori).toHaveLife(19);
  });
});
