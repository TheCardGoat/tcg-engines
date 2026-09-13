/**
 * AST003 Cap of Quick Thinking — Lightning Head (no printed defense).
 *
 * Printed:
 *   Instant - Destroy this: If you would be dealt damage by a source an
 *   opponent controls this turn, you may discard an Instant card to prevent 1
 *   of that damage and draw a card.
 *
 * Model:
 *   Instant destroy-self → prevention fixed 1 this-turn, source opponent,
 *   optionalCost discard Instant, additionalModification draw 1.
 *
 * Reasoning:
 * 1. Prevention with optionalCost/additionalModification was unsupported —
 *    now registers multi-fire this-turn and presents the defender with an
 *    explicit choice of which eligible Instant to discard when damage would
 *    be dealt by an opponent-controlled source.
 * 2. Source opponent filter: only opponent damage (attack hits), not own.
 * 3. No Instant in hand → prevention does not apply (optional unpaid).
 * 4. Destroy-self is the activation cost (cap leaves head immediately).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, sigilOfSolaceRed, nimblismBlue } from "../../../fixtures.ts";
import { capOfQuickThinking } from "../../../../../../cards/src/cards/equipment/cap-of-quick-thinking.ts";

const SNATCH = 4;

function advanceToOptionalReplacement(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let passes = 0; passes < 12; passes += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "option") return;
    if (decision) throw new Error(`Expected optional replacement choice, got ${decision.kind}.`);
    if (game.declareNoDefenseIfPending()) continue;
    const priorityPlayerId = game.getPriorityPlayerId();
    if (!priorityPlayerId) break;
    game.pass(priorityPlayerId);
  }
  throw new Error("Optional replacement choice was not reached.");
}

describe("cap-of-quick-thinking (AST003)", () => {
  it("core mechanic: destroy-self → opponent damage, discard Instant, prevent 1 and draw", () => {
    // Activate Instant on the defend step of the opponent's attack so
    // this-turn prevention is still armed when combat damage resolves.
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [capOfQuickThinking],
        hand: [sigilOfSolaceRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    // Defend step priority: Instant activate Cap.
    Bravo.defendWith([]);
    game.as(dash).pass();
    Bravo.activate(capOfQuickThinking);
    game.passBoth();
    expect(Bravo.zone("head")).not.toContain(capOfQuickThinking.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(capOfQuickThinking.canonicalId);
    expect(game.getState().replacementEffects.some((r) => r.controllerId === Bravo.id)).toBe(true);

    // No block — present and explicitly accept the replacement, then select
    // the precise Instant that pays its cost.
    advanceToOptionalReplacement(game);
    const choice = Bravo.expectDecision("option");
    Bravo.chooseOptions(choice.options[0]!.id);
    Bravo.chooseTargets(sigilOfSolaceRed);
    game.helpers.resolveRestOfCombat();

    // snatch 4 − prevent 1 = 3 damage → life 17.
    expect(Bravo.life()).toBe(20 - (SNATCH - 1));
    // Instant discarded for the optional cost.
    expect(Bravo.zone("graveyard")).toContain(sigilOfSolaceRed.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(sigilOfSolaceRed.canonicalId);
    // Drew 1 after prevent.
    expect(Bravo.zone("hand").length).toBe(1);
  });

  it("boundaries: no Instant in hand → full damage (optional unpaid)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [capOfQuickThinking],
        hand: [nimblismBlue], // Action, not Instant
        deck: 4,
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith([]);
    game.as(dash).pass();
    Bravo.activate(capOfQuickThinking);
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    expect(Bravo.life()).toBe(20 - SNATCH);
    expect(Bravo.zone("hand")).toContain(nimblismBlue.canonicalId);
  });

  it("boundaries: destroy-self is paid even if no later damage occurs", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [capOfQuickThinking],
        hand: [sigilOfSolaceRed],
        deck: 4,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(capOfQuickThinking);
    game.passBoth();
    expect(Bravo.zone("graveyard")).toContain(capOfQuickThinking.canonicalId);
    expect(Bravo.life()).toBe(20);
  });
});
