import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { miniMeataxe } from "./mini-meataxe.ts";

/**
 * Mini-Meataxe (HVY007) — Brute Weapon Axe 1H 3{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack
 *   When this attacks, draw a card then discard a random card.
 */

describe("Mini-Meataxe (HVY007) AAA", () => {
  it("happy: attacking draws then discards a random card", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [miniMeataxe],
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activateAttack(miniMeataxe);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Rhinar).toHaveHandCount(1);
    expect(Rhinar.zone("graveyard").length).toBe(1);
  });

  it("boundary: once-per-turn Attack cannot activate a second time this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [miniMeataxe],
        hand: [brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activateAttack(miniMeataxe);
    game.closeCombat();

    expect(() => Rhinar.activateAttack(miniMeataxe)).toThrow();
    expectFabCard(Rhinar, miniMeataxe).toBeIn("weapon1");
  });

  it("timing: draw then discard keeps hand size after an empty-hand attack", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [miniMeataxe],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activateAttack(miniMeataxe);
    game.advanceUntil({ stopAt: "defend" });

    expectFabPlayer(Rhinar).toHaveHandCount(0);
    expectFabCard(Rhinar, nimblismBlue).toBeIn("graveyard");
  });
});
