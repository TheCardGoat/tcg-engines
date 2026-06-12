import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "../../../testing";

const SHIFT_NAME = "Shifty Mock";

const shiftKeywordAbility = {
  type: "keyword" as const,
  keyword: "Shift" as const,
  text: "Shift 2",
  cost: { ink: 2 },
};

const shiftBase = createMockCharacter({
  id: "shift-base",
  name: SHIFT_NAME,
  version: "Original",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

const shiftCandidate = createMockCharacter({
  id: "shift-candidate",
  name: SHIFT_NAME,
  version: "Upgraded",
  cost: 4,
  classifications: ["Floodborn", "Hero"],
  abilities: [shiftKeywordAbility],
});

function actionWithPlayCard(playMethod: "either" | "shift") {
  return createMockAction({
    id: `play-${playMethod}-action`,
    name: `Play ${playMethod} Action`,
    cost: 1,
    text: `Play a character via ${playMethod}.`,
    abilities: [
      {
        type: "action",
        text: `Play a character via ${playMethod}.`,
        effect: {
          type: "play-card",
          cardType: "character",
          cost: "free",
          from: "hand",
          playMethod,
        },
      },
    ],
  });
}

describe("play-card playMethod", () => {
  it("'either' routes to Shift when a legal in-play shift base is selected", () => {
    const action = actionWithPlayCard("either");
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [action, shiftCandidate],
      play: [shiftBase],
      inkwell: action.cost,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().playCard(action, {
        targets: [shiftCandidate, shiftBase],
      }),
    ).toBeSuccessfulCommand();

    const projected = testEngine.asPlayerOne().getCard(shiftCandidate);
    expect(testEngine.asPlayerOne().getCardZone(shiftCandidate)).toBe("play");
    expect(projected.playedViaShift).toBe(true);
    expect(Array.isArray(projected.cardsUnder) && projected.cardsUnder.length).toBeGreaterThan(0);
  });

  it("'either' falls back to standard when no shift base is selected", () => {
    const action = actionWithPlayCard("either");
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [action, shiftCandidate],
      play: [shiftBase],
      inkwell: action.cost,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().playCard(action, {
        targets: [shiftCandidate],
      }),
    ).toBeSuccessfulCommand();

    const projected = testEngine.asPlayerOne().getCard(shiftCandidate);
    expect(testEngine.asPlayerOne().getCardZone(shiftCandidate)).toBe("play");
    expect(projected.playedViaShift ?? false).toBe(false);
    expect(projected.cardsUnder ?? []).toEqual([]);
    // Base remains untouched in play.
    expect(testEngine.asPlayerOne().getCardZone(shiftBase)).toBe("play");
  });

  it("'either' does not resolve when only the in-play shift base is selected", () => {
    const action = actionWithPlayCard("either");
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [action, shiftCandidate],
      play: [shiftBase],
      inkwell: action.cost,
      deck: 1,
    });

    const result = testEngine.asPlayerOne().playCard(action, {
      targets: [shiftBase],
    });

    if (result.success) {
      expect(testEngine.asPlayerOne().getCardZone(shiftCandidate)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(shiftBase)).toBe("play");
    } else {
      expect(testEngine.asPlayerOne().getCardZone(shiftCandidate)).toBe("hand");
    }
  });

  it("'shift' fails to resolve when no shift base is selected (regression guard)", () => {
    const action = actionWithPlayCard("shift");
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [action, shiftCandidate],
      play: [shiftBase],
      inkwell: action.cost,
      deck: 1,
    });

    // The engine should treat this as an invalid selection rather than auto-playing the card.
    const result = testEngine.asPlayerOne().playCard(action, {
      targets: [shiftCandidate],
    });

    // Either the command itself fails OR the candidate was never moved into play.
    const candidateInPlay = testEngine.asPlayerOne().getCardZone(shiftCandidate) === "play";
    if (result.success) {
      expect(candidateInPlay).toBe(false);
    } else {
      expect(candidateInPlay).toBe(false);
    }
  });
});
