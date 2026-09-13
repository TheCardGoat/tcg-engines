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
import { tekloBaseLegs } from "../equipment/teklo-base-legs.ts";
import { snatchRed } from "./snatch.ts";
import { tekloBlaster } from "../weapons/teklo-blaster.ts";
import { evoRapidFireBlue } from "./evo-rapid-fire.ts";

/**
 * Evo Rapid Fire (TCC010) — Mechanologist Action Equipment Evo Legs d2 BW.
 *
 * Printed: If you have a base legs equipped, transform it into this, then
 * equip this. Your Teklo Blaster attacks get go again. Battleworn.
 *
 * Seat Teklovossen (not Dash).
 */

describe("Evo Rapid Fire (TCC010) AAA", () => {
  it("happy: seated Rapid Fire grants go again to Teklo Blaster attacks", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [evoRapidFireBlue],
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
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: without Rapid Fire, Teklo Blaster attacks have no go again", () => {
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
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("happy: with a base legs equipped, this transforms into the legs slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [tekloBaseLegs],
        hand: [evoRapidFireBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoRapidFireBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoRapidFireBlue).toBeIn("legs");
    expect(Teklo.zone("legs")).not.toContain(tekloBaseLegs.canonicalId);
  });

  it("timing: Battleworn d2 first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: teklovossen, life: 20, legs: [evoRapidFireBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).attackWith(snatchRed);
    Teklo.defendWith(evoRapidFireBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Teklo, evoRapidFireBlue).toBeIn("legs");
    expectFabCard(Teklo, evoRapidFireBlue).toHaveDefenseCounters(-1);
    expectFabPlayer(Teklo).toHaveLife(18);
  });
});
