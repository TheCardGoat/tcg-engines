import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { cogwerxBlunderbuss } from "./cogwerx-blunderbuss.ts";

/**
 * Cogwerx Blunderbuss (SEA006) — Mechanologist Weapon Gun 2H, power 2.
 *
 * Printed: Action - {r}{r}, {t}: Attack
 */

describe("Cogwerx Blunderbuss (SEA006) AAA", () => {
  it("happy: activateAttack opens combat at printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [cogwerxBlunderbuss],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );

    game.as(dash).activateAttack(cogwerxBlunderbuss);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(2);
  });

  it("boundary: insufficient resources cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [cogwerxBlunderbuss],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).expectActivationRejected(cogwerxBlunderbuss);
    expectCombat(game).toBeClosed();
  });

  it("timing: the tapped weapon cannot attack again this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [cogwerxBlunderbuss],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activateAttack(cogwerxBlunderbuss);
    game.closeCombat({ optionals: "decline" });
    expectFabCard(Dash, cogwerxBlunderbuss).toBeTapped();
    Dash.expectActivationRejected(cogwerxBlunderbuss);
  });
});
