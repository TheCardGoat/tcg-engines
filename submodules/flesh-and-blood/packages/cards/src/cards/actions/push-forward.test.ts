import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { pushForwardRed } from "./push-forward.ts";

/**
 * Push Forward (CRU094) — Warrior Action.
 * Printed: "Your next weapon attack this turn gains +3{p}.
 * If you have attacked with a weapon this turn, your next attack this turn
 * gains dominate. Go again"
 *
 * a1 is a floating next-weapon-attack latch (CR 1.11 this-turn scope); a2's
 * dominate grant is conditional on a weapon attack having already happened
 * THIS turn when Push Forward resolves (CR 1.8 — a continuous effect exists
 * only while its condition is true at creation); Go again refunds the action
 * point at layer resolution (CR 7.6.2).
 */

const nimblismDeck = [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
] as const;

describe("Push Forward (CRU094) AAA", () => {
  it("happy: the next weapon attack this turn gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [pushForwardRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: [...nimblismDeck],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.play(pushForwardRed);
    game.helpers.untilIdle();

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
  });

  it("dominate: with a weapon attack already this turn, the next attack caps hand defense", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [pushForwardRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 3,
        deck: [...nimblismDeck],
      },
      { hero: dash, life: 20, hand: [snatchRed, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    // Weapon attack first, so a2's condition holds when Push Forward resolves.
    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();

    Kassai.play(pushForwardRed);
    game.helpers.untilIdle();

    Kassai.attackWith(snatchRed);
    game.advanceCombatTo("defend");

    // Dominate: at most one defending card from hand (CR 7.4.2 dominate).
    const rejection = game.as(dash).expectBlockRejected([snatchRed, snatchRed]);
    expect(rejection.errorCode).toBe("dominate");
  });

  it("boundary: no weapon attack this turn — no dominate, a two-card block is legal", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [pushForwardRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: [...nimblismDeck],
      },
      { hero: dash, life: 20, hand: [snatchRed, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    // No weapon attack yet — a2's condition fails, so no dominate is granted.
    Kassai.play(pushForwardRed);
    game.helpers.untilIdle();

    Kassai.attackWith(snatchRed);
    game.advanceCombatTo("defend");

    game.as(dash).defendWith(snatchRed, snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("go again: the action point is refunded at resolution", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [pushForwardRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [...nimblismDeck],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(kassaiOfTheGoldenSand).play(pushForwardRed);
    game.helpers.untilIdle();

    expectFabPlayer(game.as(kassaiOfTheGoldenSand)).toHaveAP(1);
  });

  it("timing: the +3{p} weapon latch expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [pushForwardRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [...nimblismDeck],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.play(pushForwardRed);
    game.helpers.untilIdle();
    Kassai.endTurn();
    game.as(dash).endTurn();
    game.helpers.untilIdle();

    // Turn 2: the saber attack is unbuffed — "this turn" expired (CR 1.11).
    // resolveUntilIdle closes combat, so the latch readout is the damage.
    Kassai.activate(cintariSaber);
    game.helpers.resolveUntilIdle({ paymentCanonicalId: nimblismBlue.canonicalId });

    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });
});
