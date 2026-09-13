import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { cerebellumProcessorBlue } from "../actions/cerebellum-processor.ts";
import { dash } from "../heroes/dash.ts";
import { maxxNitro } from "../heroes/maxx-nitro.ts";
import { bankBreaker } from "./bank-breaker.ts";

/**
 * Bank Breaker (AMX022) — Mechanologist Weapon Wrench 2H, power 3.
 *
 * Printed:
 *   Twice per Turn Action - {r}: Attack. Activate this only if you've cranked this turn.
 *   When this attacks, you may banish a card from under it. If you do, the attack
 *   gets overpower and go again.
 */

describe("Bank Breaker (AMX022) AAA", () => {
  it("happy: after cranking this turn, activateAttack opens combat at 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        weapon1: [bankBreaker],
        hand: [cerebellumProcessorBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    Maxx.must.play(cerebellumProcessorBlue);
    game.untilIdle();

    Maxx.activateAttack(bankBreaker, { stopAt: "on-attack" });
    Maxx.decline();
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: cannot attack unless you have cranked this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        weapon1: [bankBreaker],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Maxx = game.as(maxxNitro);

    expect(() => Maxx.activateAttack(bankBreaker)).toThrow(/activation condition is not satisfied/);
    expectFabCard(Maxx, bankBreaker).toBeIn("weapon1");
    expectCombat(game).toBeClosed();
  });

  it("timing: with nothing under this, the attack does not gain overpower or go again", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        weapon1: [bankBreaker],
        hand: [cerebellumProcessorBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    Maxx.must.play(cerebellumProcessorBlue);
    game.untilIdle();
    Maxx.activateAttack(bankBreaker, { stopAt: "on-attack" });
    Maxx.decline();
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).notToHaveKeyword("overpower");
    expectCombat(game).notToHaveKeyword("go-again");
  });
});
