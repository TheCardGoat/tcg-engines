import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { snatchRed } from "./snatch.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { emboldenedBladeBlue } from "./emboldened-blade.ts";

/**
 * Emboldened Blade (EVO240) — Warrior Action, cost 0, 3{d}, go again.
 *
 * Printed: Turn a face-down card in any arsenal face-up. If it's a defense
 * reaction, destroy it and your next weapon attack this turn gets +1{p}.
 * Go again.
 */

describe("Emboldened Blade (EVO240) AAA", () => {
  it("happy: turning a face-down defense reaction face-up destroys it and +1{p}s the next weapon", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [emboldenedBladeBlue],
        arsenal: [{ card: sinkBelowRed, state: { faceDown: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(emboldenedBladeBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dori, sinkBelowRed).toBeIn("graveyard");
    expectFabPlayer(Dori).toHaveAP(1);

    Dori.activate(dawnblade);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: a face-down non-defense-reaction stays in arsenal and does not buff the weapon", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [emboldenedBladeBlue],
        arsenal: [{ card: snatchRed, state: { faceDown: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(emboldenedBladeBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dori, snatchRed).toBeIn("arsenal").toBeFaceUp();

    Dori.activate(dawnblade);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: a non-weapon attack is not the next weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [emboldenedBladeBlue, brutalAssaultBlue],
        arsenal: [{ card: sinkBelowRed, state: { faceDown: true } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(emboldenedBladeBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Dori.attackWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });
});
