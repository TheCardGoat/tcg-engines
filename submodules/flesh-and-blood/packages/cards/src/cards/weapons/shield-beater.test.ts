import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { shieldBeater } from "./shield-beater.ts";

/**
 * Shield Beater (PEN015) — Guardian Weapon Hammer 1H, power 5.
 *
 * Printed: Action - {r}{r}{r}{r}, {t}: Attack
 */

describe("Shield Beater (PEN015) AAA", () => {
  it("happy: activateAttack opens combat at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [shieldBeater],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(bravo).activateAttack(shieldBeater);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: insufficient resources cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [shieldBeater],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).expectActivationRejected(shieldBeater);
    expectCombat(game).toBeClosed();
  });

  it("timing: the tapped weapon cannot attack again this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [shieldBeater],
        resourcePoints: 8,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(shieldBeater);
    game.closeCombat({ optionals: "decline" });
    expectFabCard(Bravo, shieldBeater).toBeTapped();
    Bravo.expectActivationRejected(shieldBeater);
  });
});
