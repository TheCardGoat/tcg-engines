import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { violetParrLearningNewPowers } from "./048-violet-parr-learning-new-powers";

const friendlyCharacter = createMockCharacter({
  id: "violet-friendly",
  name: "Friendly Character",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const opposingCharacter = createMockCharacter({
  id: "violet-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 4,
});

const damagedOpposingSource = createMockCharacter({
  id: "violet-damaged-opponent-source",
  name: "Damaged Opponent Source",
  cost: 2,
  strength: 1,
  willpower: 4,
});

describe("Violet Parr - Learning New Powers", () => {
  it("DEFLECT - moves 1 damage from chosen character to chosen opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [violetParrLearningNewPowers],
        inkwell: violetParrLearningNewPowers.cost,
        play: [{ card: friendlyCharacter, damage: 2 }],
      },
      {
        play: [opposingCharacter],
      },
    );

    expect(testEngine.asPlayerOne().playCard(violetParrLearningNewPowers)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(violetParrLearningNewPowers, {
        resolveOptional: true,
        targets: [friendlyCharacter, opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(friendlyCharacter)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(1);
  });

  it("DEFLECT can move damage from an opposing damaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [violetParrLearningNewPowers],
        inkwell: violetParrLearningNewPowers.cost,
        play: [{ card: friendlyCharacter, damage: 1 }],
      },
      {
        play: [{ card: damagedOpposingSource, damage: 2 }, opposingCharacter],
      },
    );

    const opposingSourceId = testEngine.findCardInstanceId(
      damagedOpposingSource,
      "play",
      "player_two",
    );
    const opposingId = testEngine.findCardInstanceId(opposingCharacter, "play", "player_two");

    expect(testEngine.asPlayerOne().playCard(violetParrLearningNewPowers)).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(violetParrLearningNewPowers, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    const [pending] = testEngine.asPlayerOne().getPendingEffects();
    const selectionContext = pending?.selectionContext;
    expect(selectionContext?.kind).toBe("target-selection");
    const targetSelectionContext =
      selectionContext?.kind === "target-selection" ? selectionContext : undefined;
    expect(targetSelectionContext?.expectedSlottedKind).toBe("move-damage");
    expect(targetSelectionContext?.targetDsl[0]).toMatchObject({
      owner: "any",
      filters: [{ type: "status", status: "damaged" }],
    });
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: {
          kind: "move-damage",
          from: [opposingSourceId],
          to: [opposingId],
        },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(friendlyCharacter)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(damagedOpposingSource)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(1);
  });
});
