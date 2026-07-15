import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  merlinSelfappointedMentor,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import { merlinIntellectualVisionary } from "@tcg/lorcana-cards/cards/005";

/**
 * THE-958:
 * Merlin - Intellectual Visionary should offer OVERDEVELOPED BRAIN when played via Shift,
 * and should not search when hard-cast.
 */
describe("THE-958 — Merlin shift entry search trigger", () => {
  it("exposes deck card candidates after accepting the optional shift trigger", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 5,
      hand: [merlinIntellectualVisionary],
      play: [merlinSelfappointedMentor],
      deck: [simbaProtectiveCub, arielOnHumanLegs],
    });

    const shiftTarget = testEngine.findCardInstanceId(
      merlinSelfappointedMentor,
      "play",
      PLAYER_ONE,
    );

    expect(
      testEngine.asPlayerOne().playCard(merlinIntellectualVisionary, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBoard().bagEffects;
    expect(bagEffect).toBeDefined();
    expect(bagEffect?.selectionContext).toMatchObject({
      kind: "optional-selection",
      submitField: "resolveOptional",
    });

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(merlinIntellectualVisionary, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    const [pendingEffect] = testEngine.asPlayerOne().getPendingEffects();
    expect(pendingEffect?.selectionContext).toMatchObject({
      kind: "target-selection",
      minSelections: 1,
      maxSelections: 1,
      allowedZones: ["deck"],
    });
    if (
      !pendingEffect?.selectionContext ||
      pendingEffect.selectionContext.kind !== "target-selection"
    ) {
      throw new Error("Expected a target-selection pending context");
    }

    expect(pendingEffect.selectionContext.cardCandidateIds.length).toBe(2);
  });

  it("triggers deck search when Merlin is played via Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 5,
      hand: [merlinIntellectualVisionary],
      play: [merlinSelfappointedMentor],
      deck: [simbaProtectiveCub, arielOnHumanLegs],
    });

    const shiftTarget = testEngine.findCardInstanceId(
      merlinSelfappointedMentor,
      "play",
      PLAYER_ONE,
    );

    expect(
      testEngine.asPlayerOne().playCard(merlinIntellectualVisionary, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(merlinIntellectualVisionary, {
        resolveOptional: true,
        targets: [arielOnHumanLegs],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("hand");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 1 });
  });

  it("does not search the deck when Merlin is hard-cast", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: merlinIntellectualVisionary.cost,
      hand: [merlinIntellectualVisionary],
      deck: [simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().playCard(merlinIntellectualVisionary)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 1 });
  });
});
