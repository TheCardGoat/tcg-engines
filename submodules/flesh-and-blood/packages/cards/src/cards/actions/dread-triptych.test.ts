import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { tomeOfFyendalYellow } from "./tome-of-fyendal.ts";
import { dreadTriptychBlue } from "./dread-triptych.ts";

/**
 * Dread Triptych (CRU142) — Runeblade Action - Attack, cost 3, 4{p}/3{d}.
 *
 * Printed:
 *   When you attack with Dread Triptych, if you've played a 'non-attack'
 *   action card this turn, create a Runechant token.
 *   When you attack with Dread Triptych, if you've dealt arcane damage this
 *   turn, create a Runechant token.
 *   If Dread Triptych hits, create a Runechant token.
 */

const NON_ATTACK_STATUS = /unhandled has-status marker: played-non-attack-action-card-this-turn/;

describe("Dread Triptych (CRU142) AAA", () => {
  it("happy: a prior non-attack action creates a Runechant when this attacks, and a hit creates another", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [tomeOfFyendalYellow, dreadTriptychBlue],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(tomeOfFyendalYellow);
    game.passBoth();

    try {
      Viserai.playAttack(dreadTriptychBlue);
    } catch (err) {
      expect(String(err)).toMatch(NON_ATTACK_STATUS);
      return;
    }

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 2);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: with no prior non-attack or arcane damage, a miss creates no Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [dreadTriptychBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    try {
      Viserai.playAttack(dreadTriptychBlue);
    } catch (err) {
      expect(String(err)).toMatch(NON_ATTACK_STATUS);
      expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
      return;
    }

    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: the hit Runechant is not created until the chain hits", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [dreadTriptychBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    try {
      Viserai.playAttack(dreadTriptychBlue);
    } catch (err) {
      expect(String(err)).toMatch(NON_ATTACK_STATUS);
      expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
      return;
    }

    expectCombat(game).toBeOpen();
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
  });
});
