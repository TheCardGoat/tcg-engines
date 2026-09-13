import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { runeSnareRed } from "./rune-snare.ts";

/**
 * Rune Snare, Red (PEN084) — Ranger Action Trap, 0-cost, 2{d}.
 * Printed: Your next arrow attack this turn gets +3{p}. Go again.
 * When this defends and the attacking hero has played or created 2 or more
 * auras this turn, destroy an aura they control.
 */

describe("Rune Snare (PEN084) AAA", () => {
  it("happy: the next arrow attack this turn gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [runeSnareRed],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(runeSnareRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a non-arrow attack after Rune Snare stays printed {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [runeSnareRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(runeSnareRed);
    game.helpers.resolveUntilIdle();
    Azalea.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
