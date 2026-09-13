/**
 * CR §6.1 Discrete Effects — atomicity (6.1.2) and conditional-once (6.1.3).
 *
 * The engine resolves a multi-step `sequence` by generating and committing
 * each discrete effect's event before the next step is generated
 * (rules/proposals/effects/sequence.ts — preview-commit per step so later
 * steps re-see intermediate state). These tests pin that invariant with the
 * canonical CR 6.1.2 example (Sand Sketched Plan: search → put → discard →
 * shuffle) plus a binding-threading probe, and assert a conditional discrete
 * effect's condition is locked at generation (6.1.3).
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { bravo, dash, heartOfFyendal, nimbleStrikeRed } from "../../fixtures.ts";
import { hitTrainer } from "../../test-trainers.ts";
import { rhinar } from "../../../../../cards/src/cards/heroes/rhinar.ts";
import { sandSketchedPlanBlue } from "../../../../../cards/src/cards/actions/sand-sketched-plan.ts";

describe("CR 6.1 — discrete-effect atomicity & conditional-once", () => {
  it("CR 6.1.2 — a four-step sequence applies every discrete effect (search→put→discard→shuffle shape)", () => {
    // Mirror Sand Sketched Plan's four atomic discrete effects with a trainer
    // so the assertion is independent of the Rhinar-specialization search path:
    // draw (≈search+put), draw, gain-life, gain-resources — four discrete steps.
    const attack = hitTrainer({
      slug: "ssp-shape",
      effect: {
        type: "sequence",
        steps: [
          { type: "draw", count: 1, player: "controller" },
          { type: "gain-life", amount: 1, target: { selector: "controller" } },
          { type: "draw", count: 1, player: "controller" },
          { type: "gain-life", amount: 1, target: { selector: "controller" } },
        ],
      },
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 10,
        hand: [attack],
        deck: [heartOfFyendal, heartOfFyendal, heartOfFyendal, heartOfFyendal],
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();
    // All four discrete effects applied. The attack card left hand for the
    // combat chain, so the two draws leave hand at 2; life 10 → 12.
    expect(game.as(bravo).handCount()).toBe(2);
    expect(game.as(bravo).life()).toBe(12);
  });

  // CR 6.1.2 canonical example. Sand Sketched Plan's catalog effect modeled its
  // search as `zones:["deck"]` with `to:{zone:"deck",position:"top"}` (reorder
  // to top, then a follow-up move-card lifted it to hand), which the engine
  // rightly rejects as a no-op same-zone transfer. The fix is a catalog remodel
  // to `to:{zone:"hand"}` (matching the printed "put it into your hand" and the
  // convention used by Plan for the Worst / Zen), dropping the redundant
  // move-card step. This test was RED before that remodel and is GREEN after.
  it("CR 6.1.2 — Sand Sketched Plan: search→put→discard→shuffle each resolve atomically", () => {
    // The canonical CR 6.1.2 example. Rhinar (specialization) plays SSP:
    // search deck for a card → put it into hand → discard a random card →
    // shuffle. Each step commits before the next is generated, so the discard
    // step sees the post-search hand (the searched card is discard-eligible).
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [sandSketchedPlanBlue],
        deck: [heartOfFyendal, heartOfFyendal, heartOfFyendal, heartOfFyendal],
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const beforeDeck = game.as(rhinar).zone("deck").length;
    game.as(rhinar).play(sandSketchedPlanBlue);
    // `answerForcedDecision` auto-picks the search target; the random discard
    // is deterministic via the seeded RNG.
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargetCanonicalId: heartOfFyendal.canonicalId,
    });
    expect(game.as(rhinar).zone("deck").length).toBe(beforeDeck - 1);
    // The searched Heart of Fyendal was put into hand (step 2), then the random
    // discard removed it to the graveyard (step 3) — proving the search→put→
    // discard chain committed atomically (the discard saw the post-search hand).
    // The graveyard also holds SSP itself, the resolved action.
    expect(game.as(rhinar).zone("graveyard")).toContain(heartOfFyendal.canonicalId);
    // Hand: played SSP (−1), search put (+1), discard (−1) → net −1.
    expect(game.as(rhinar).handCount()).toBe(0);
  });

  it("CR 6.1.3 — a conditional discrete effect locks its branch at generation (single evaluation)", () => {
    // Heart of Fyendal pitch trigger: "If your <opponent's> life is greater,
    // gain 1 life." The condition is evaluated once at generation (pitch time).
    // Pitch HoF as payment for a cost-1 strike while behind → +1 life locked in.
    const behind = FabTestEngine.start(
      {
        hero: bravo,
        life: 10,
        hand: [heartOfFyendal, nimbleStrikeRed],
        deck: 4,
        resourcePoints: 0,
      },
      { hero: dash, life: 15, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    behind.as(bravo).play(nimbleStrikeRed, { pitch: [heartOfFyendal], target: behind.as(dash).id });
    behind.helpers.resolveUntilIdle({ optionalBoolean: false });
    // Condition true at generation (10 < 15) → +1 life locked in.
    expect(behind.as(bravo).life()).toBe(11);
  });
});
