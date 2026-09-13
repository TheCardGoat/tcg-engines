import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchYellow } from "./snatch.ts";
import { zeroToSixtyBlue } from "./zero-to-sixty.ts";
import { rumblingOfIArathaelRed } from "./rumbling-of-i-arathael.ts";

/**
 * Rumbling of i'Arathael, Red — Generic Action - Attack, cost 2, 6{p}.
 *
 * Printed: "If a card has been put into your banished zone this turn, this
 * gets overpower."
 */

describe("Rumbling of i'Arathael AAA", () => {
  it("happy: a card put into your banished zone this turn grants overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyBlue, rumblingOfIArathaelRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [nimblismBlue, snatchYellow], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    Dash.playAttack(zeroToSixtyBlue, { boost: true });
    game.closeCombat();
    Dash.playAttack(rumblingOfIArathaelRed);
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("overpower");

    const rejection = Azalea.expectFailure({
      move: "defend",
      payload: {
        instanceIds: Azalea.findCardsInZone("hand", [nimblismBlue, snatchYellow]),
      },
    });
    expect(rejection.errorCode).toBe("overpower");
  });

  it("boundary: without a banished card this turn, a two-action defense is legal", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [rumblingOfIArathaelRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [nimblismBlue, snatchYellow], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    Dash.playAttack(rumblingOfIArathaelRed);
    expectCombat(game).toBeAtStep("defend").notToHaveKeyword("overpower");

    Azalea.defendWith(nimblismBlue, snatchYellow);
  });
});
