import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { crossTheLineRed } from "../actions/cross-the-line.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { resoundingCourageRed } from "./resounding-courage.ts";

/**
 * Resounding Courage, Red (DTD069) — Light Warrior Attack Reaction, cost 1,
 * 3{d}.
 *
 * Printed: "Target Light Warrior attack gets +3{p}. If you've charged this
 * turn, create a Courage token."
 *
 * Attack-reaction power is asserted after `playReaction` + `passBoth` (the
 * layer must resolve onto the link). Charge is paid on Cross the Line's
 * optional additional cost so charged-this-turn is live for the token.
 */

describe("Resounding Courage (DTD069) AAA", () => {
  it("happy: +3{p} on a Light Warrior attack, and a charge this turn creates Courage", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, nimblismBlue, resoundingCourageRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(crossTheLineRed, { charge: true, chargeCard: nimblismBlue });
    game.advanceCombatTo("reaction");
    Boltyn.must.playReaction(resoundingCourageRed);
    game.passBoth();

    // Cross the Line 5 + 3 = 8.
    expectCombat(game).toHaveAttackPower(8);
    expectFabCard(Boltyn, resoundingCourageRed).toBeIn("graveyard");
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 1);
    expect(Boltyn.zone("arena")).toContain("token:courage");
  });

  it("boundary: no charge this turn — +3{p} still lands, no Courage token", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, resoundingCourageRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.must.playAttack(crossTheLineRed);
    game.advanceCombatTo("reaction");
    Boltyn.must.playReaction(resoundingCourageRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(8);
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 0);
    expect(Boltyn.zone("arena")).not.toContain("token:courage");
  });

  it("boundary: cannot target a non-Light-Warrior attack", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [snatchRed, resoundingCourageRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expect(() => Boltyn.must.playReaction(resoundingCourageRed)).toThrow();
    expectFabCard(Boltyn, resoundingCourageRed).toBeIn("hand");
  });
});
