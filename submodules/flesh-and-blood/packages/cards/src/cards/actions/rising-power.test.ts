import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "./snatch.ts";
import { tomeOfFyendalYellow } from "./tome-of-fyendal.ts";
import { nimblismBlue } from "./nimblism.ts";
import { risingPowerRed } from "./rising-power.ts";

/**
 * Rising Power (HVY146) — Brute / Guardian Action - Attack, cost 2, 6{p}, 2{d}.
 *
 * Printed: "If you've drawn a card this turn, this gets +1{p}."
 *
 * `drawn-a-card-this-turn` is a handled marker. Tome of Fyendal is the draw
 * vehicle.
 */

const nimblismDeck = [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
] as const;

describe("Rising Power family AAA", () => {
  it("happy: drawing a card this turn grants +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [tomeOfFyendalYellow, risingPowerRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: [...nimblismDeck],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();
    Rhinar.attackWith(risingPowerRed);
    game.advanceCombatTo("defend");

    // Printed 6 + 1 = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: without drawing this turn, this stays at printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [risingPowerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(risingPowerRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: a draw from last turn does not grant +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [tomeOfFyendalYellow, risingPowerRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: [...nimblismDeck],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();
    Rhinar.endTurn();
    game.as(dash).endTurn();
    game.helpers.untilIdle();

    Rhinar.attackWith(risingPowerRed, { pitch: [nimblismBlue] });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, hand: [risingPowerRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Rhinar.defendWith([risingPowerRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveLife(18);
    expectFabCard(Rhinar, risingPowerRed).toBeIn("graveyard");
  });
});
