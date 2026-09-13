import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhimGrandfatherOfEternity } from "../heroes/oldhim-grandfather-of-eternity.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { breakGroundRed } from "./break-ground.ts";

/**
 * Break Ground (ELE131) — Earth Action - Attack, cost 3, 7{p}/2{d}.
 *
 * Printed: "When you attack with Break Ground, you may put a card from your
 * arsenal on the bottom of your deck. If you do, draw a card."
 */

describe("Break Ground (ELE131) AAA", () => {
  it("happy: putting arsenal on the bottom of the deck draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [breakGroundRed],
        arsenal: [nimblismBlue],
        deckTop: [snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.playAttack(breakGroundRed, { stopAt: "on-attack" });
    Oldhim.accept();
    Oldhim.target(nimblismBlue);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(7);
    expect(Oldhim.cardsIn("deck", nimblismBlue)).toHaveLength(1);
    expectFabCard(Oldhim, snatchRed).toBeIn("hand");
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Oldhim, breakGroundRed).toBeIn("graveyard");
  });

  it("boundary: empty arsenal does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [breakGroundRed],
        deckTop: [snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.playAttack(breakGroundRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(7);
    expect(Oldhim.cardsIn("deck", snatchRed)).toHaveLength(1);
    game.closeCombat();
    expectFabPlayer(Oldhim).toHaveHandCount(0);
  });

  it("timing: declining leaves the arsenal card in arsenal and does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [breakGroundRed],
        arsenal: [nimblismBlue],
        deckTop: [snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.playAttack(breakGroundRed, { stopAt: "on-attack" });
    Oldhim.decline();
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(Oldhim, nimblismBlue).toBeIn("arsenal");
    expect(Oldhim.cardsIn("deck", snatchRed)).toHaveLength(1);
    game.closeCombat();
  });
});
