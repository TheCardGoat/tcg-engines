import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { spellbladeAssaultRed } from "./spellblade-assault.ts";

/**
 * Spellblade Assault (ARC085) — Runeblade Action - Attack, cost 2, 4{p}/3{d}.
 *
 * Printed: "When you attack with Spellblade Assault, create 2 Runechant tokens."
 */

describe("Spellblade Assault (ARC085) AAA", () => {
  it("happy: attacking creates 2 Runechant tokens under the controller", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [spellbladeAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(spellbladeAssaultRed);

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 2);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("runechant", 0);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: a different attack does not mint Spellblade's Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(brutalAssaultBlue);

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
  });

  it("timing: tokens exist at attack declaration, before the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [spellbladeAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(spellbladeAssaultRed);
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 2);
    expectCombat(game).toBeOpen();

    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 2);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
