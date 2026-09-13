import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { chane } from "./chane.ts";
import { galaxxiBlack } from "../weapons/galaxxi-black.ts";
import { spellbladeStrikeRed } from "../actions/spellblade-strike.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Chane (CHN001).
 *
 * Implements the per-hero AAA requirements from HEROES.md:
 * - Core mechanic: Once per Turn Action — create a Soul Shackle token;
 *   next Runeblade or Shadow action gains go again; ability has go again
 * - Core interaction: Soul Shackle creation as cost, next Runeblade AAC
 *   gains go again from the continuous grant
 * - Boundaries: OPT limit, Generic actions excluded, second activation
 *   illegal
 *
 * Signature weapon: Galaxxi Black (CHN003)
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// chane (CHN001) — Shadow/Runeblade/Young — 20hp
// Printed: "Once per Turn Action - Create a Soul Shackle token: Your next
// Runeblade or Shadow action this turn gains go again. Go again"
// ---------------------------------------------------------------------------

describe("chane (CHN001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start({ hero: chane, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(chane)).toHaveLife(20);
  });

  it("core mechanic: activate creates Soul Shackle; ability go again refunds the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Chane = game.as(chane);

    Chane.activate(chane);
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Chane).toHaveTokenCount("soul-shackle", 1);
    // −1 AP to activate Action, +1 from go again on the ability.
    expect(Chane.actionPoints()).toBe(1);
  });

  it("core interaction: next Runeblade action gains go again from the continuous grant", () => {
    // Spellblade Strike is a Runeblade AAC without printed go again.
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [spellbladeStrikeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = game.as(chane);

    Chane.activate(chane);
    game.untilIdle({ ordering: "listed" });
    expectFabPlayer(Chane).toHaveTokenCount("soul-shackle", 1);
    expect(Chane.actionPoints()).toBe(1);

    Chane.must.playAttack(spellbladeStrikeRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Continuous appliesTo.next latched go again onto the Runeblade AAC —
    // AP is available again after the chain closes.
    expect(Chane.actionPoints()).toBe(1);
  });

  it("boundaries: once per turn — second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Chane = game.as(chane);

    Chane.activate(chane);
    game.untilIdle({ ordering: "listed" });
    expectFabPlayer(Chane).toHaveTokenCount("soul-shackle", 1);

    Chane.expectActivationRejected(chane);
    // Still only one Soul Shackle from the first activation.
    expectFabPlayer(Chane).toHaveTokenCount("soul-shackle", 1);
  });

  it("boundaries: Generic action does not receive the go-again grant", () => {
    // Snatch is Generic — not Runeblade or Shadow.
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = game.as(chane);

    Chane.activate(chane);
    game.untilIdle({ ordering: "listed" });

    Chane.must.playAttack(snatchRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Snatch is Generic — the grant latched nothing onto it.
    expectCombat(game).toBeClosed();
    expect(Chane.actionPoints()).toBe(0);
  });

  it("signature weapon: Galaxxi Black (CHN003) can attack for 1{r} with base power 1", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        weapon1: [galaxxiBlack],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = game.as(chane);

    Chane.activate(galaxxiBlack);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(1);
  });

  it("signature weapon: Galaxxi Black hit deals 1 arcane damage to the defending hero", () => {
    // Galaxxi Black a3: on hit → 1 arcane to attack target.
    const game = FabTestEngine.start(
      {
        hero: chane,
        weapon1: [galaxxiBlack],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = game.as(chane);
    const Opponent = game.as(opponentHero);
    const lifeBefore = Opponent.life();

    Chane.activate(galaxxiBlack);
    game.helpers.resolveRestOfCombat();

    // Combat damage 1 + arcane 1 = 2 total.
    expect(Opponent.life()).toBe(lifeBefore - 2);
  });
});
