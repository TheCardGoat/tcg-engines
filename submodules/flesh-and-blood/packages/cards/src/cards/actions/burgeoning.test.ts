import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { burgeoningRed } from "./burgeoning.ts";

/**
 * Burgeoning (ELE134) — "If this was played from arsenal, it gains +1{p}."
 * Printed 6{p}.
 */

describe("Burgeoning (ELE134) AAA", () => {
  it("happy: played from hand this stays at printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [burgeoningRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).playAttack(burgeoningRed);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: hand play deals printed 6 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [burgeoningRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).playAttack(burgeoningRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("happy: played from arsenal this gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        arsenal: [{ card: burgeoningRed, state: { faceDown: false } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).playAttack(burgeoningRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });
});
