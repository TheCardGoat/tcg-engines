/**
 * DTD165 Shroud of Darkness — Shadow Head (no printed defense) + Blood Debt.
 *
 * Printed:
 *   If your hero would be dealt damage, you may banish this to prevent 2 of
 *   that damage.
 *
 * Model (after fix):
 *   continuous while-in-arena prevention fixed 2, optionalCost banish-self
 *
 * Reasoning:
 * 1. "Banish this" is banish-self, not banish any arena permanent (parser
 *    emitted from:arena count 1 — wrong identity for the cost).
 * 2. Continuous static prevention is collected live from equipped seats via
 *    staticReplacementCandidates; optionalCost banish-self was unsupported
 *    (only optional discard Instant existed for Cap of Quick Thinking).
 * 3. The defender explicitly accepts the banish-self replacement when damage would be dealt;
 *    once banished the piece cannot re-fire.
 * 4. Blood Debt (end-phase life loss while banished) is keyword-tested
 *    elsewhere — not re-exercised here.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { shroudOfDarkness } from "../../../../../../cards/src/cards/equipment/shroud-of-darkness.ts";

const SNATCH = 4;

describe("shroud-of-darkness (DTD165)", () => {
  it("core mechanic: banish-self → prevent 2 of combat damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [shroudOfDarkness],
        hand: [],
        deck: 6,
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("head")).toContain(shroudOfDarkness.canonicalId);

    game.as(dash).attackWith(snatchRed);
    game.advanceToDecision(Bravo, "option");
    const choice = Bravo.expectDecision("option");
    Bravo.chooseOptions(choice.options[0]!.id);
    game.helpers.resolveRestOfCombat();

    // snatch 4 − prevent 2 = 2 damage → life 18.
    expect(Bravo.life()).toBe(20 - (SNATCH - 2));
    // Banish this → leaves head, sits in banished (not GY).
    expect(Bravo.zone("head")).not.toContain(shroudOfDarkness.canonicalId);
    expect(Bravo.zone("banished")).toContain(shroudOfDarkness.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(shroudOfDarkness.canonicalId);
  });

  it("boundaries: after banished, second hit deals full damage (one-shot)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: bravo,
        head: [shroudOfDarkness],
        hand: [],
        deck: 6,
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // First attack: prevent 2, shroud banishes.
    Dash.attackWith(snatchRed);
    game.advanceToDecision(Bravo, "option");
    const choice = Bravo.expectDecision("option");
    Bravo.chooseOptions(choice.options[0]!.id);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.life()).toBe(20 - (SNATCH - 2));
    expect(Bravo.zone("banished")).toContain(shroudOfDarkness.canonicalId);

    // Second attack: no prevention available.
    // Need AP for a second action — may need turn advance if go-again missing.
    // Snatch is a 0-cost attack; ensure Dash still has AP or start a fresh turn.
    if (game.getState().players[Dash.id]!.actionPoints < 1) {
      // Drain priority and advance until Dash has a turn with AP.
      for (let i = 0; i < 20; i += 1) {
        if (game.getState().decision) break;
        const prio = game.getState().priority?.holderPlayerId;
        if (!prio) break;
        game.exec({ move: "pass", actorId: prio, payload: {} });
        if (
          game.getState().activePlayerId === Dash.id &&
          game.getState().players[Dash.id]!.actionPoints >= 1 &&
          !game.combat()
        ) {
          break;
        }
      }
    }
    // If still no AP, advance through a full public turn cycle instead of
    // mutating player state.
    if (game.getState().players[Dash.id]!.actionPoints < 1) {
      if (game.getState().activePlayerId === Dash.id) Dash.endTurn();
      if (game.getState().activePlayerId === Bravo.id) Bravo.endTurn();
    }
    expect(Dash.actionPoints()).toBeGreaterThanOrEqual(1);

    const lifeBeforeSecondHit = Bravo.life();
    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.life()).toBe(lifeBeforeSecondHit - SNATCH);
    // Still only one copy in banished.
    expect(Bravo.zone("banished").filter((id) => id === shroudOfDarkness.canonicalId)).toHaveLength(
      1,
    );
  });

  it("boundaries: without shroud equipped, full combat damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6, life: 20 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).life()).toBe(20 - SNATCH);
  });
});
