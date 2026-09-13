import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { kassai } from "../heroes/kassai.ts";
import { holdEmRed } from "./hold-em.ts";

/**
 * Hold 'em Red (HVY130) — Warrior Action, cost 1, 3{d}, go again.
 *
 * Printed: 'Your next Warrior attack this turn gets +3{p} and "When this
 * attacks a hero, you may wager a Vigor token with them." Go again'
 */

describe("hold-em family AAA", () => {
  it("happy: the next Warrior attack gets +3{p} and may wager Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [holdEmRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.play(holdEmRed);
    game.helpers.resolveUntilIdle();
    Kassai.activateAttack(cintariSaber, { stopAt: "on-attack" });
    Kassai.accept();
    game.advanceUntil({ stopAt: "defend" });

    // Cintari Saber printed 2 + 3 = 5.
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();

    expectFabPlayer(Kassai).toHaveTokenCount("vigor", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("vigor", 0).toHaveLife(15);
    expectFabCard(Kassai, holdEmRed).toBeIn("graveyard");
  });

  it("boundary: a Generic attack stays at printed 4{p} and does not wager", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [holdEmRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.play(holdEmRed);
    game.helpers.resolveUntilIdle();
    Kassai.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    expectFabPlayer(Kassai).toHaveTokenCount("vigor", 0);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("vigor", 0).toHaveLife(16);
  });

  it("timing: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [holdEmRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    expectFabPlayer(Kassai).toHaveAP(1);
    Kassai.play(holdEmRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Kassai).toHaveAP(1);
  });
});
