import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zen } from "../heroes/zen.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { slither } from "./slither.ts";

/**
 * Slither (MST024) — target attack action card gets go again.
 */

describe("Slither (MST024) AAA", () => {
  it("happy: target attack action gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [snatchRed, slither],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Zen.must.playReaction(slither);
    game.passBoth();
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveAP(1);
  });

  it("boundary: cannot play without an attack action on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [slither],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);
    expect(() => Zen.must.playReaction(slither)).toThrow(/not legal/);
  });

  it("boundary: defends cannot use this ephemeral reaction from hand as a block", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [slither],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Zen = game.as(zen);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expect(() => Zen.defendWith([slither])).toThrow(/no defense/);
    expect(Zen.zone("hand")).toContain(slither.canonicalId);
  });
});
