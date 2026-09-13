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
import { tekloBaseArms } from "../equipment/teklo-base-arms.ts";
import { snatchRed } from "./snatch.ts";
import { tekloBlaster } from "../weapons/teklo-blaster.ts";
import { evoScatterShotBlue } from "./evo-scatter-shot.ts";

/**
 * Evo Scatter Shot (TCC009) — Mechanologist Action Equipment Evo Arms d2 BW.
 *
 * Printed: If you have a base arms equipped, transform it into this, then
 * equip this. Your Teklo Blaster gets +1{p} for each opposing hero.
 * Battleworn.
 *
 * Seat Teklovossen (not Dash). 1v1: opposing heroes = 1 → Teklo Blaster 2{p} → 3{p}.
 */

describe("Evo Scatter Shot (TCC009) AAA", () => {
  it("happy: 1v1 +1{p} makes Teklo Blaster attack at 3", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [evoScatterShotBlue],
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
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: without Scatter Shot, Teklo Blaster stays at printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        weapon1: [tekloBlaster],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(teklovossen).activateAttack(tekloBlaster);
    expectCombat(game).toHaveAttackPower(2);
  });

  it("happy: with a base arms equipped, this transforms into the arms slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [tekloBaseArms],
        hand: [evoScatterShotBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoScatterShotBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoScatterShotBlue).toBeIn("arms");
    expect(Teklo.zone("arms")).not.toContain(tekloBaseArms.canonicalId);
  });

  it("timing: Battleworn d2 first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: teklovossen, life: 20, arms: [evoScatterShotBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).attackWith(snatchRed);
    Teklo.defendWith(evoScatterShotBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Teklo, evoScatterShotBlue).toBeIn("arms");
    expectFabCard(Teklo, evoScatterShotBlue).toHaveDefenseCounters(-1);
    expectFabPlayer(Teklo).toHaveLife(18);
  });
});
