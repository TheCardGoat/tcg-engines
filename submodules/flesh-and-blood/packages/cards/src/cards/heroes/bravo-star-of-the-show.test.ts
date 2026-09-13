import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { bravoStarOfTheShow } from "./bravo-star-of-the-show.ts";
import { disableRed } from "../actions/disable.ts";
import { snatchRed } from "../actions/snatch.ts";
import { evergreenRed as evergreen } from "../actions/evergreen.ts";
import { frostFangBlue } from "../actions/frost-fang.ts";
import { lightningSurgeRed } from "../actions/lightning-surge.ts";
import { nimblismBlue } from "../actions/nimblism.ts";

/**
 * Hero behavior acceptance test — Bravo, Star of the Show (EVR017).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: reveal Earth + Ice + Lightning → next cost≥3 attack
 *   gains +2{p}, dominate, go again
 * - Core interaction: dominate enforced (rejects multi-card defense)
 * - Boundaries: no reveal = no bonus, only next attack, only cost≥3,
 *   go again refunds AP
 *
 * Essence: Earth, Ice, Lightning — Adult hero (40hp)
 */

// Elemental cards for reveal: Earth, Ice, Lightning

const hero = bravoStarOfTheShow;
const opponentHero = dash;

// ---------------------------------------------------------------------------
// bravo-star-of-the-show (EVR017) — Elemental Guardian Hero — 40hp
// Printed: "At the start of your turn, you may reveal an Earth, an Ice, and
// a Lightning card from your hand. If you do, the next attack action card
// with cost 3 or greater you play this turn gains +2{p}, dominate, and
// go again."
// ---------------------------------------------------------------------------

describe("bravo-star-of-the-show (EVR017)", () => {
  it("boundaries: adult hero defaults to 40 life", () => {
    const game = FabTestEngine.start({ hero, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(hero)).toHaveLife(40);
  });

  it("core mechanic: revealing Earth, Ice, and Lightning grants the next cost-3 attack bonuses", () => {
    const game = FabTestEngine.start(
      {
        hero,
        hand: [evergreen, frostFangBlue, lightningSurgeRed, disableRed],
        resourcePoints: 5, // for disable-red cost
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(hero);
    const Opponent = game.as(opponentHero);

    // The fixture starts in Bravo's action phase. Cycle to the next Bravo
    // turn so the printed start-of-turn trigger is emitted.
    Bravo.endTurn();
    Opponent.endTurn();

    // Resolve start-of-turn optional reveal trigger (accept = true).
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    Bravo.attackWith(disableRed);

    // Assert — the cost≥3 attack should carry dominate.
    expectCombat(game).toHaveAttackPower(11).toHaveKeyword("dominate").toHaveKeyword("go-again");
  });

  it("core interaction: dominate from the reveal rejects a two-card defense", () => {
    const game = FabTestEngine.start(
      {
        hero,
        hand: [evergreen, frostFangBlue, lightningSurgeRed, disableRed],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: opponentHero, life: 20, hand: [snatchRed, nimblismBlue], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(hero);
    const Opponent = game.as(opponentHero);

    Bravo.endTurn();
    Opponent.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    Bravo.attackWith(disableRed);

    // Assert — cost≥3 attack carries dominate, two-card defense rejected.
    expectCombat(game).toHaveKeyword("dominate");
    expect(Opponent.expectBlockRejected([snatchRed, nimblismBlue]).errorCode).toBe("dominate");
  });

  it("boundaries: only the first qualifying attack gains the reveal bonus", () => {
    const game = FabTestEngine.start(
      {
        hero,
        hand: [
          evergreen,
          frostFangBlue,
          lightningSurgeRed,
          disableRed,
          disableRed,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
        ],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(hero);
    const Opponent = game.as(opponentHero);

    Bravo.endTurn();
    Opponent.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    // First attack (cost 5 ≥ 3) should get dominate.
    Bravo.attackWith(disableRed);
    expectCombat(game).toHaveKeyword("dominate");
    game.helpers.resolveRestOfCombat();

    // The grant is "the next" qualifying attack, so the second Disable is
    // legal via the refunded action point but must receive none of its terms.
    Bravo.attackWith(disableRed);
    expectCombat(game).notToHaveKeyword("dominate").toHaveAttackPower(9);
  });

  it("boundaries: without the reveal, a cost-2 attack does not gain the bonus", () => {
    const game = FabTestEngine.start(
      {
        hero,
        hand: [evergreen, frostFangBlue, lightningSurgeRed, snatchRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(hero);

    // snatchRed is cost 1 (< 3 threshold) — should not get dominate.
    Bravo.attackWith(snatchRed);

    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("boundaries: go again from the reveal restores the action point after the attack", () => {
    const game = FabTestEngine.start(
      {
        hero,
        hand: [evergreen, frostFangBlue, lightningSurgeRed, disableRed],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(hero);
    const Opponent = game.as(opponentHero);

    Bravo.endTurn();
    Opponent.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    const apBefore = Bravo.actionPoints();

    Bravo.attackWith(disableRed);
    game.helpers.resolveRestOfCombat();

    // Go again should refund the action point spent.
    // After playing, AP should be same as before (1 spent, 1 refunded).
    expect(Bravo.actionPoints()).toBe(apBefore);
  });

  it("boundaries: without the reveal, the attack does not gain dominate", () => {
    // No elemental cards in hand = cannot reveal.
    const game = FabTestEngine.start(
      {
        hero,
        hand: [disableRed],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(hero);

    Bravo.attackWith(disableRed);

    // No reveal → no dominate.
    expectCombat(game).notToHaveKeyword("dominate");
  });
});
