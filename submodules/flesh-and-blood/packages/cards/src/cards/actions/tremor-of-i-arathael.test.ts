import { describe, it } from "vitest";
import { expectCombat, expectFabCard, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zeroToSixtyBlue } from "./zero-to-sixty.ts";
import { azalea } from "../heroes/azalea.ts";
import { nimblismBlue } from "./nimblism.ts";
import { tremorOfIArathaelRed } from "./tremor-of-i-arathael.ts";

/**
 * Tremor of i'Arathael (MON254) — Generic Action - Attack, cost 1, 4{p}.
 *
 * Printed: If a card has been put into your banished zone this turn, this
 * gains +2{p}.
 */

describe("Tremor of i'Arathael (MON254) AAA", () => {
  it("happy: a card put into your banished zone this turn grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyBlue, tremorOfIArathaelRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(zeroToSixtyBlue, { boost: true });
    game.closeCombat();
    Dash.playAttack(tremorOfIArathaelRed);

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Dash, tremorOfIArathaelRed).toBeIn("combatChain");
  });

  it("boundary: without a banished card this turn, it stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [tremorOfIArathaelRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(tremorOfIArathaelRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: a card banished last turn does not grant +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyBlue, tremorOfIArathaelRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    Dash.playAttack(zeroToSixtyBlue, { boost: true });
    game.closeCombat();
    Dash.endTurn();
    Azalea.endTurn();
    Dash.must.pitch(nimblismBlue).playAttack(tremorOfIArathaelRed);

    expectCombat(game).toHaveAttackPower(4);
  });
});
