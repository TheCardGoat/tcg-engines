import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { phoenixFormRed } from "./phoenix-form.ts";

/**
 * Phoenix Form (UPR048) — Draconic Ninja Action Attack, 3{p} 3{d} cost 0.
 *
 * Printed: If you control 1 or more Phoenix Flames, this has go again.
 * If you control 2 or more, it has +2{p}. If you control 3 or more, it has
 * "When this hits a hero, draw 3 cards."
 */

describe("Phoenix Form (UPR048) AAA", () => {
  it("three Phoenix Flame links grant go again, +2{p}, and draw 3 on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, phoenixFlameRed, phoenixFlameRed, phoenixFormRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(phoenixFormRed);

    expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
    game.closeCombat();
    // Earlier Draconic Phoenix Flame links still deal (2+ chain links → +1{p} each
    // on the later flames). Form 5 plus those links is 7.
    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(Fai).toHaveHandCount(3);
  });

  it("boundary: as the first link this stays 3{p} without go again", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [phoenixFormRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(fai).playAttack(phoenixFormRed);

    expectCombat(game).toHaveAttackPower(3).notToHaveKeyword("go-again");
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("timing: one Phoenix Flame grants go again but not +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, phoenixFormRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(phoenixFormRed);

    expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
  });
});
