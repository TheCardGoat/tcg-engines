import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseHead } from "../equipment/teklo-base-head.ts";
import { snatchRed } from "./snatch.ts";
import { tekloBlaster } from "../weapons/teklo-blaster.ts";
import { evoTekloscopeBlue } from "./evo-tekloscope.ts";

/**
 * Evo Tekloscope (TCC007) — Mechanologist Action Equipment Evo Head d2 BW.
 *
 * Printed: If you have a base head equipped, transform it into this, then
 * equip this. Your Teklo Blaster attacks can target any opposing hero.
 * Battleworn.
 *
 * Seat Teklovossen (not Dash). 1v1: the sole opposing seat is already the
 * only attack candidate; multi-opponent targeting is out of scope.
 */

describe("Evo Tekloscope (TCC007) AAA", () => {
  it("happy: with a base head equipped, this transforms into the head slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        hand: [evoTekloscopeBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoTekloscopeBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Teklo, evoTekloscopeBlue).toBeIn("head");
    expect(Teklo.zone("head")).not.toContain(tekloBaseHead.canonicalId);
  });

  it("boundary: without a base head equipped this does not enter the head slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoTekloscopeBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoTekloscopeBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expect(Teklo.zone("head")).not.toContain(evoTekloscopeBlue.canonicalId);
  });

  it("timing: Battleworn d2 first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: teklovossen, life: 20, head: [evoTekloscopeBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).attackWith(snatchRed);
    Teklo.defendWith(evoTekloscopeBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Teklo, evoTekloscopeBlue).toBeIn("head");
    expectFabCard(Teklo, evoTekloscopeBlue).toHaveDefenseCounters(-1);
    expectFabPlayer(Teklo).toHaveLife(18);
  });

  it("1v1: seated Tekloscope still lets Teklo Blaster attack the sole opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [evoTekloscopeBlue],
        weapon1: [tekloBlaster],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(teklovossen).activateAttack(tekloBlaster);
    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(bravo)).toHaveLife(18);
  });
});
