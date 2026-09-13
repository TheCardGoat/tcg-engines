import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { barbedBarrageRed } from "./barbed-barrage.ts";

/**
 * Barbed Barrage, Red (SEA098) — Ranger Arrow Attack Action.
 *
 * Printed: "As an additional cost to play this, you may pay {r}{r}{r}. If you
 * do, this attacks an additional target." (cost 1, 5{p}, 3{d})
 */

describe("Barbed Barrage (SEA098) AAA", () => {
  it("happy: declining the optional 3{r} still attacks the defending hero for 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: barbedBarrageRed, state: { faceDown: false } }],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.attackWith(barbedBarrageRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(Azalea, barbedBarrageRed).toBeIn("graveyard");
  });

  it("boundary: the arrow cannot be played from hand even with a bow", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [barbedBarrageRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    expect(() => Azalea.playAttack(barbedBarrageRed)).toThrow();
    expectFabCard(Azalea, barbedBarrageRed).toBeIn("hand");
  });

  it("timing PIN: attackWith auto-declines the optional 3{r}; printed 5{p} still lands", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: barbedBarrageRed, state: { faceDown: false } }],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.attackWith(barbedBarrageRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    // Cost 1 paid; optional extra 3{r} is declined (attack-flow options omit modes).
    expectFabPlayer(Azalea).toHaveResourceCount(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });
});
