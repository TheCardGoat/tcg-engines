import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { crossTheLineRed } from "./cross-the-line.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { chargeOfTheLightBrigadeRed } from "./charge-of-the-light-brigade.ts";

/**
 * Charge of the Light Brigade, Red (DTD072) — Light Warrior Action, cost 0,
 * 3{d}, go again.
 *
 * Printed: "The next attack you charge to play this turn gets +3{p}. Go again."
 */

describe("charge-of-the-light-brigade family AAA", () => {
  it("happy: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [chargeOfTheLightBrigadeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    expectFabPlayer(Boltyn).toHaveAP(1);
    Boltyn.play(chargeOfTheLightBrigadeRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Boltyn).toHaveAP(1);
    expectFabCard(Boltyn, chargeOfTheLightBrigadeRed).toBeIn("graveyard");
  });

  it("happy: charging the next attack grants +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [chargeOfTheLightBrigadeRed, crossTheLineRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(chargeOfTheLightBrigadeRed);
    game.helpers.resolveUntilIdle();
    Boltyn.attackWith(crossTheLineRed, { charge: true, chargeCard: nimblismBlue });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(8);
    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
  });

  it("boundary: an uncharged follow-up attack stays at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [chargeOfTheLightBrigadeRed, crossTheLineRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(chargeOfTheLightBrigadeRed);
    game.helpers.resolveUntilIdle();
    Boltyn.attackWith(crossTheLineRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [chargeOfTheLightBrigadeRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Boltyn.defendWith([chargeOfTheLightBrigadeRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(19);
    expectFabCard(Boltyn, chargeOfTheLightBrigadeRed).toBeIn("graveyard");
  });
});
