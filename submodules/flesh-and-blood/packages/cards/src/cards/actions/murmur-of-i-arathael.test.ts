import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { zeroToSixtyBlue } from "./zero-to-sixty.ts";
import { murmurOfIArathaelRed } from "./murmur-of-i-arathael.ts";

/**
 * Murmur of i'Arathael, Red — Generic Action - Attack, cost 1, 4{p}.
 *
 * Printed: "If a card has been put into your banished zone this turn, this
 * gets go again."
 */

describe("Murmur of i'Arathael AAA", () => {
  it("happy: a card put into your banished zone this turn grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyBlue, murmurOfIArathaelRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(zeroToSixtyBlue, { boost: true });
    game.closeCombat();
    Dash.playAttack(murmurOfIArathaelRed);
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Dash, murmurOfIArathaelRed).toBeIn("combatChain");
    game.closeCombat();

    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: without a banished card this turn, it does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [murmurOfIArathaelRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(murmurOfIArathaelRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveAP(0);
  });
});
