import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { crossTheLineRed } from "../actions/cross-the-line.ts";
import { sigilOfSolaceYellow } from "../instants/sigil-of-solace.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { beamingBlade } from "./beaming-blade.ts";

/**
 * Beaming Blade (DTD046) — Light Warrior Weapon - Sword - 2H, base 0{p}.
 * Printed: "Once per Turn Action - {r}{r}: Attack. If a yellow card has
 * been put into your hero's soul this turn, this gets +5{p}."
 */

describe("Beaming Blade (DTD046) AAA", () => {
  it("happy: a yellow card charged to soul this turn raises this to 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [beamingBlade],
        hand: [crossTheLineRed, sigilOfSolaceYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(crossTheLineRed, {
      charge: true,
      chargeCard: sigilOfSolaceYellow,
    });
    game.closeCombat();
    Boltyn.activateAttack(beamingBlade);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: without a yellow soul-charge this turn this stays 0{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [beamingBlade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.activateAttack(beamingBlade);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(0);
  });

  it("timing: a NON-yellow soul-charge does not raise this", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [beamingBlade],
        hand: [crossTheLineRed, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(crossTheLineRed, {
      charge: true,
      chargeCard: nimblismBlue,
    });
    game.closeCombat();
    Boltyn.activateAttack(beamingBlade);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(0);
  });
});
