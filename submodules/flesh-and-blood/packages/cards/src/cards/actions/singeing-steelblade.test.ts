import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { singeingSteelbladeRed } from "./singeing-steelblade.ts";

/**
 * Singeing Steelblade (ELE230) — Runeblade Attack, cost 1, 4{p}.
 *
 * Printed: When you attack with this, deal 1 arcane damage to target hero.
 */

describe("Singeing Steelblade (ELE230) AAA", () => {
  it("happy: deals 1 arcane on attack plus 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [singeingSteelbladeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(singeingSteelbladeRed, { stopAt: "on-attack" });
    Viserai.target(Dash);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: combat damage is still printed 4{p} after the ping", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [singeingSteelbladeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(singeingSteelbladeRed, { stopAt: "on-attack" });
    Viserai.target(game.as(dash));
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: on-attack arcane resolves before combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [singeingSteelbladeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(singeingSteelbladeRed, { stopAt: "on-attack" });
    Viserai.target(Dash);
    game.advanceUntil({ stopAt: "defend" });
    expectFabPlayer(Dash).toHaveLife(19);
    expectCombat(game).toBeOpen();
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(15);
  });
});
