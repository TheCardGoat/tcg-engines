import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { madameMedusaDiamondLover } from "@tcg/lorcana-cards/cards/007";
import { mirabelMadrigalCuriousChild } from "@tcg/lorcana-cards/cards/008";
import { scarFinallyKing } from "@tcg/lorcana-cards/cards/009";
import { hadesLookingForADeal } from "@tcg/lorcana-cards/cards/010";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

// Generic safety net regression: optional triggered abilities whose inner effect
// starts with a `select-target` step (often via a `sequence`) used to surface a
// degenerate target-selection prompt with `cardCandidateIds: []` and
// `effectType: null` when the board had no valid candidates. The UI could not
// render the picker AND could not present a decline button — the bag entry was
// effectively unresolvable.
//
// Fix: in `selection-context.buildImmediateSelectionContext`, the optional →
// target-selection merge now requires at least one candidate. With zero
// candidates we fall back to the standard yes/no `optional-selection` prompt so
// the controller can decline cleanly.
//
// This test locks the contract for every card we currently ship with that
// pattern. New cards using `optional → sequence → select-target` should be
// added here.

describe("Optional triggered abilities | UI prompt fallback when no valid targets", () => {
  it("Scar - Finally King: surfaces declinable optional prompt with no Ally", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: scarFinallyKing, exerted: true }], deck: 10 },
      { deck: 5 },
    );

    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(1);

    const snapshot = snapshotPendingPrompt(engine);
    expect(snapshot?.kind).toBe("optional-selection");
  });

  it("Mirabel Madrigal - Curious Child: surfaces declinable optional prompt with no song in hand", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mirabelMadrigalCuriousChild],
      inkwell: mirabelMadrigalCuriousChild.cost,
      deck: 1,
    });

    expect(engine.asPlayerOne().playCard(mirabelMadrigalCuriousChild)).toBeSuccessfulCommand();

    if (engine.asPlayerOne().getBagCount() === 0) {
      // Acceptable: the engine auto-fizzled the trigger before it surfaced.
      return;
    }

    const snapshot = snapshotPendingPrompt(engine);
    expect(snapshot?.kind).toBe("optional-selection");
  });

  it("Madame Medusa - Diamond Lover: surfaces declinable optional prompt with no other character", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [madameMedusaDiamondLover],
      deck: 5,
    });

    // Force her to be ready and dry by passing a turn.
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().quest(madameMedusaDiamondLover)).toBeSuccessfulCommand();

    if (engine.asPlayerOne().getBagCount() === 0) {
      return;
    }

    const snapshot = snapshotPendingPrompt(engine);
    expect(snapshot?.kind).toBe("optional-selection");
  });

  it("Hades - Looking for a Deal: surfaces declinable optional prompt with no opposing characters", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hadesLookingForADeal],
        inkwell: hadesLookingForADeal.cost,
        deck: 1,
      },
      { deck: 5 },
    );

    expect(engine.asPlayerOne().playCard(hadesLookingForADeal)).toBeSuccessfulCommand();

    if (engine.asPlayerOne().getBagCount() === 0) {
      return;
    }

    const snapshot = snapshotPendingPrompt(engine);
    expect(snapshot?.kind).toBe("optional-selection");
  });

  it("regression: when candidates DO exist, the engine still merges into a single target-selection prompt", () => {
    const ally = createMockCharacter({
      id: "regression-ally",
      name: "Some Ally",
      cost: 2,
      strength: 3,
      willpower: 3,
      classifications: ["Storyborn", "Ally"],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: scarFinallyKing, exerted: true }, ally], deck: 10 },
      { deck: 5 },
    );

    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(1);

    const snapshot = snapshotPendingPrompt(engine);
    // With a candidate present, the optional→target-selection merge stays in
    // effect: the prompt is a `target-selection` with at least one candidate.
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.cardCandidateIds.length).toBeGreaterThan(0);
  });
});
