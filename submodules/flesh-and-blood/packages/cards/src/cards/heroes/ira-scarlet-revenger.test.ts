import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { iraScarletRevenger } from "./ira-scarlet-revenger.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Ira, Scarlet Revenger (ASR001).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: second attack each turn gets +1{p}
 * - Boundaries: first attack unbuffed, third attack unbuffed, 40hp Adult
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// ira-scarlet-revenger (ASR001) — Ninja — 20hp
// Printed: "Your second attack each turn gets +1{p}."
// ---------------------------------------------------------------------------

describe("ira-scarlet-revenger (ASR001)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hero: iraScarletRevenger, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(iraScarletRevenger)).toHaveLife(40);
  });

  it("core mechanic: second attack each turn gets +1 power (first does not)", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Ira = game.as(iraScarletRevenger);
    const Opponent = game.as(opponentHero);

    const attacks = Ira.cardsIn("hand", snatchRed);

    // First attack: base power 4 — no bonus.
    Ira.must.playAttack(attacks[0]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(16); // 20 - 4

    // Second attack: base power 4 + 1 from second-attack bonus = 5.
    Ira.must.playAttack(attacks[1]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(11); // 16 - 5
  });

  it("boundaries: only the SECOND attack gets +1 — a third attack is unbuffed", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [snatchRed, snatchRed, snatchRed],
        actionPoints: 3,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Ira = game.as(iraScarletRevenger);
    const Opponent = game.as(opponentHero);

    const attacks = Ira.cardsIn("hand", snatchRed);

    Ira.must.playAttack(attacks[0]!); // 20 - 4 = 16
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(16);
    Ira.must.playAttack(attacks[1]!); // 16 - 5 = 11
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(11);
    Ira.must.playAttack(attacks[2]!); // 11 - 4 = 7 (no third-attack bonus)
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(7);
  });
});
