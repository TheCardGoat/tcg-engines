import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { boltOfCourageYellow } from "../actions/bolt-of-courage.ts";
import { serBoltynBreakerOfDawn } from "./ser-boltyn-breaker-of-dawn.ts";
import { luminaAscensionYellow } from "../actions/lumina-ascension.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";

/**
 * Ser Boltyn, Breaker of Dawn (MON029) — Light Warrior Hero 40hp.
 *
 * Printed AR: Banish a card from Boltyn's soul: Target attack with {p} greater
 * than its base {p} gains go again.
 */

describe("Ser Boltyn, Breaker of Dawn (MON029) AAA", () => {
  it("happy: banish soul so a p>base attack gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: serBoltynBreakerOfDawn,
        hand: [boltOfCourageYellow, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(serBoltynBreakerOfDawn);
    const Dash = game.as(dash);

    Boltyn.attackWith(boltOfCourageYellow, { charge: true, chargeCard: nimblismBlue });
    Dash.defendWith(snatchRed);
    game.toReaction("attacker");
    Boltyn.activate(serBoltynBreakerOfDawn);
    game.passBoth();

    expectFabCard(Boltyn, nimblismBlue).toBeIn("banished");
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: at-base power does not gain go again", () => {
    const game = FabTestEngine.start(
      {
        hero: serBoltynBreakerOfDawn,
        hand: [boltOfCourageYellow],
        soul: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(serBoltynBreakerOfDawn);

    Boltyn.attackWith(boltOfCourageYellow);
    game.toReaction("attacker");
    Boltyn.expectActivationRejected(serBoltynBreakerOfDawn);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("boundary: without charge, a defended attack stays at printed {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: serBoltynBreakerOfDawn,
        hand: [boltOfCourageYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(serBoltynBreakerOfDawn);
    const Dash = game.as(dash);

    Boltyn.attackWith(boltOfCourageYellow);
    Dash.defendWith(snatchRed);

    expectFabCard(Boltyn, boltOfCourageYellow).toHavePower(2);
    expectFabPlayer(Boltyn).toHaveLife(40);
  });

  it("targets a buffed weapon attack through its active attack proxy", () => {
    const game = FabTestEngine.start(
      {
        hero: serBoltynBreakerOfDawn,
        hand: [luminaAscensionYellow],
        soul: [nimblismBlue],
        weapon1: [cintariSaber],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(serBoltynBreakerOfDawn);

    Boltyn.play(luminaAscensionYellow);
    game.untilIdle();
    Boltyn.activateAttack(cintariSaber);
    expectCombat(game).toHaveAttackPower(3);
    game.toReaction("attacker");
    Boltyn.activate(serBoltynBreakerOfDawn);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Boltyn, nimblismBlue).toBeIn("banished");
    expectFabPlayer(Boltyn).toHaveAP(1);
  });
});
