import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { fireInTheHoleRed } from "./fire-in-the-hole.ts";

/**
 * Fire in the Hole (SEA101) — Ranger Action.
 *
 * Printed:
 *   Your next arrow attack this turn gets +3{p}.
 *   You may {u} a bow you control.
 *   Go again
 */

describe("Fire in the Hole (SEA101) AAA", () => {
  it("happy: the next arrow attack this turn gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [fireInTheHoleRed],
        arsenal: [searingShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(fireInTheHoleRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Azalea.attackWith(searingShotRed, { from: "arsenal" });

    // Searing Shot base 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a non-arrow attack does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [fireInTheHoleRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(fireInTheHoleRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Azalea.attackWith(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the play AP and may {u} a bow you control", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [{ card: deathDealer, state: { tapped: true } }],
        hand: [fireInTheHoleRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(fireInTheHoleRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: deathDealer.canonicalId,
    });

    expectFabPlayer(Azalea).toHaveAP(1);
    expectFabCard(Azalea, deathDealer).toBeReady();
  });
});
