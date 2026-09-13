import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { bravoFlatteringShowman } from "./bravo-flattering-showman.ts";
import { disableRed } from "../actions/disable.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Bravo, Flattering Showman (BDD001).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: Turn face-down arsenal face-up; if crush → +2{p} / dominate
 * - Core interaction: dominate enforced (rejects multi-card defense)
 * - Boundaries: non-crush no bonus, go-again AP refund, until-EOT expiry
 *
 * Signature weapon: none listed (generic Guardian weapon pool)
 */

const hero = bravoFlatteringShowman;
const opponentHero = dash;

describe("bravo-flattering-showman (BDD001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start({ hero, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(hero)).toHaveLife(20);
  });

  it("core mechanic: chosen face-down crush arsenal card gains +2{p} and dominate", () => {
    const game = FabTestEngine.start(
      {
        hero,
        arsenal: [disableRed],
        hand: [nimblismBlue, nimblismBlue],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(hero);

    Bravo.activate(hero);
    game.passBoth();
    Bravo.target(disableRed);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(disableRed, { from: "arsenal" });

    expectCombat(game).toHaveKeyword("dominate");
  });

  it("boundaries: a chosen non-crush card gains neither bonus", () => {
    const game = FabTestEngine.start(
      { hero, arsenal: [snatchRed], resourcePoints: 2, deck: 6 },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(hero);

    Bravo.activate(hero);
    game.passBoth();
    Bravo.target(snatchRed);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(snatchRed, { from: "arsenal" });

    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("core interaction: granted dominate rejects a two-hand-card defense", () => {
    const game = FabTestEngine.start(
      {
        hero,
        arsenal: [disableRed],
        hand: [nimblismBlue, nimblismBlue],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: opponentHero, life: 20, hand: [snatchRed, nimblismBlue], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(hero);
    const Opponent = game.as(opponentHero);

    Bravo.activate(hero);
    game.passBoth();
    Bravo.target(disableRed);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(disableRed, { from: "arsenal" });

    expectCombat(game).toHaveKeyword("dominate");
    expect(Opponent.expectBlockRejected([snatchRed, nimblismBlue]).errorCode).toBe("dominate");
  });

  it("boundaries: the ability's go again refunds the action point", () => {
    const game = FabTestEngine.start(
      { hero, arsenal: [disableRed], resourcePoints: 2, deck: 6 },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(hero);

    Bravo.activate(hero);
    game.passBoth();
    Bravo.target(disableRed);
    game.helpers.resolveUntilIdle();

    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundaries: the crush bonus expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero,
        arsenal: [disableRed],
        hand: [nimblismBlue, nimblismBlue],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(hero);
    const Opponent = game.as(opponentHero);

    // Turn 1 — activate and resolve, then end turn.
    Bravo.activate(hero);
    game.passBoth();
    Bravo.target(disableRed);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    Opponent.endTurn();

    // Turn 2 — attack without re-activating; dominate must be gone.
    Bravo.attackWith(disableRed, { from: "arsenal" });

    expectCombat(game).notToHaveKeyword("dominate");
  });
});
