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
import { tekloBaseChest } from "../equipment/teklo-base-chest.ts";
import { snatchRed } from "./snatch.ts";
import { tekloBlaster } from "../weapons/teklo-blaster.ts";
import { evoEnergyMatrixBlue } from "./evo-energy-matrix.ts";

/**
 * Evo Energy Matrix (TCC008) — Mechanologist Action Equipment Evo Chest d2 BW.
 *
 * Printed: If you have a base chest equipped, transform it into this, then
 * equip this. Your Teklo Blaster costs {r} less to activate for each opposing
 * hero. Battleworn.
 *
 * Seat Teklovossen (not Dash). 1v1: opposing heroes = 1 → activate 3{r} → 2{r}.
 */

describe("Evo Energy Matrix (TCC008) AAA", () => {
  it("happy: 1v1 discount lets Teklo Blaster activate for 2{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [evoEnergyMatrixBlue],
        weapon1: [tekloBlaster],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activateAttack(tekloBlaster);
    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(2);
    expectFabPlayer(Teklo).toHaveResourceCount(0);
  });

  it("boundary: without Energy Matrix, 2{r} cannot activate Teklo Blaster", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        weapon1: [tekloBlaster],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expect(() => Teklo.activateAttack(tekloBlaster)).toThrow();
    expectCombat(game).toBeClosed();
  });

  it("timing: with a base chest equipped, this transforms into the chest slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
        hand: [evoEnergyMatrixBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoEnergyMatrixBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Teklo, evoEnergyMatrixBlue).toBeIn("chest");
    expect(Teklo.zone("chest")).not.toContain(tekloBaseChest.canonicalId);
  });

  it("timing: Battleworn d2 first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: teklovossen, life: 20, chest: [evoEnergyMatrixBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).attackWith(snatchRed);
    Teklo.defendWith(evoEnergyMatrixBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Teklo, evoEnergyMatrixBlue).toBeIn("chest");
    expectFabCard(Teklo, evoEnergyMatrixBlue).toHaveDefenseCounters(-1);
    expectFabPlayer(Teklo).toHaveLife(18);
  });
});
