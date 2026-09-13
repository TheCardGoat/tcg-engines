import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { laceWithFrailtyRed } from "./lace-with-frailty.ts";

/**
 * Lace with Frailty (OUT113) — Ranger Action, cost 0, go again.
 *
 * Printed: Your next arrow attack this turn gains +3{p} and "When this hits a
 * hero, create a Frailty token under their control."
 */

describe("Lace with Frailty (OUT113) AAA", () => {
  it("happy: the next arrow gets +3{p} and a hit creates Frailty under their control", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [laceWithFrailtyRed],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(laceWithFrailtyRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);
    expectFabCard(Azalea, laceWithFrailtyRed).toBeIn("graveyard");

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(12);
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 1);
  });

  it("boundary: a non-arrow attack played after Lace with Frailty gets no +3", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [laceWithFrailtyRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(laceWithFrailtyRed);
    game.helpers.resolveUntilIdle();

    Azalea.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 0);
  });

  it("timing: go again refunds the action point; the token is created only after the arrow hits", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [laceWithFrailtyRed],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(laceWithFrailtyRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 0);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 0);

    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 1);
  });
});
