import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue, deathDealer } from "../shared/test-recipients.ts";
import { silverTheTipRed } from "./silver-the-tip.ts";
import { dryPowderShotRed } from "./dry-powder-shot.ts";

/**
 * Dry Powder Shot, Red (SEA106) — Ranger Action - Arrow - Attack, cost 0,
 * 3{p}, 3{d}.
 * Printed: "When this is put face-up into your arsenal, it gets +2{p}
 * this turn."
 * Driver: Silver the Tip puts Dry Powder Shot face up into arsenal.
 */

const DECK = [
  brutalAssaultBlue,
  brutalAssaultBlue,
  brutalAssaultBlue,
  dryPowderShotRed,
  brutalAssaultBlue,
  brutalAssaultBlue,
] as const;

describe("Dry Powder Shot, Red (SEA106) AAA", () => {
  it("happy: gains +2{p} when put face up into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [silverTheTipRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: [...DECK],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(silverTheTipRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: dryPowderShotRed.canonicalId,
      ordering: "listed",
    });
    Azalea.playAttack(dryPowderShotRed, { from: "arsenal" });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: an arsenal-seated arrow that was never PUT face up stays 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [dryPowderShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(dryPowderShotRed, { from: "arsenal" });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: the +2{p} charges expire at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [silverTheTipRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: [...DECK],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(silverTheTipRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: dryPowderShotRed.canonicalId,
      ordering: "listed",
    });
    Azalea.endTurn();
    game.as(dash).endTurn();
    Azalea.playAttack(dryPowderShotRed, { from: "arsenal" });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(3);
  });
});
