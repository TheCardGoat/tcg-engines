import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { takeAimRed } from "./take-aim.ts";

// take-aim-red (ARC054) — Ranger Action, cost 0, go again, reload.
// Printed: "The next Ranger attack action card you play this turn, gains +3{p}."
describe("take-aim-red (ARC054) AAA", () => {
  it("happy: the next Ranger attack action card gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [takeAimRed],
        arsenal: [searingShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    // Decline optional reload (CR 8.5.23); the arrow is already seated in arsenal.
    Azalea.play(takeAimRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Azalea.playAttack(searingShotRed, { from: "arsenal" });
    // Searing Shot base power 4 + 3 from Take Aim = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: without Take Aim the arrow attacks at its printed base power", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [searingShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(searingShotRed, { from: "arsenal" });
    // No Take Aim → Searing Shot stays at its printed 4 (the +3 is not intrinsic).
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to play Take Aim", () => {
    const game = FabTestEngine.start(
      { hero: azalea, hand: [takeAimRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    expectFabPlayer(Azalea).toHaveAP(1);
    Azalea.play(takeAimRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    // −1 AP to play the Action, +1 AP from go again = still 1 (enables the follow-up attack).
    expectFabPlayer(Azalea).toHaveAP(1);
  });
});
