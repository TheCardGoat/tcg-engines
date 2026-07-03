import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { rapunzelFlynnRiderUnlikelyPair } from "./100-rapunzel-flynn-rider-unlikely-pair";

const rapunzelShiftBase = createMockCharacter({
  id: "rapunzel-flynn-unlikely-pair-shift-base",
  name: "Rapunzel",
  cost: 2,
});

const drawnCard = createMockCharacter({
  id: "rapunzel-flynn-unlikely-pair-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "rapunzel-flynn-unlikely-pair-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

const replayedCharacter = createMockCharacter({
  id: "rapunzel-flynn-unlikely-pair-replayed-character",
  name: "Replayed Character",
  cost: 2,
});

const discardChosenCard = createMockAction({
  id: "rapunzel-flynn-unlikely-pair-discard-action",
  name: "Discard Chosen Card",
  cost: 1,
  text: "Choose and discard a card.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "discard",
        amount: 1,
        target: "CONTROLLER",
        chosen: true,
      },
    },
  ],
});

describe("Rapunzel & Flynn Rider - Unlikely Pair", () => {
  it("can shift onto a character named Rapunzel", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rapunzelFlynnRiderUnlikelyPair],
      inkwell: 3,
      play: [rapunzelShiftBase],
    });

    const shiftTarget = testEngine.findCardInstanceId(rapunzelShiftBase, "play", "player_one");

    expect(
      testEngine.asPlayerOne().playCard(rapunzelFlynnRiderUnlikelyPair, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(rapunzelFlynnRiderUnlikelyPair)).toBe("play");
  });

  it("may draw a card and discard a card when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelFlynnRiderUnlikelyPair],
      hand: [discardFodder],
      deck: [drawnCard],
    });

    expect(testEngine.asPlayerOne().quest(rapunzelFlynnRiderUnlikelyPair)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(rapunzelFlynnRiderUnlikelyPair, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [discardFodderId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
  });

  it("may play the character card you discard during your turn from discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelFlynnRiderUnlikelyPair],
      hand: [discardChosenCard, replayedCharacter],
      inkwell: discardChosenCard.cost + replayedCharacter.cost,
    });

    expect(testEngine.asPlayerOne().playCard(discardChosenCard)).toBeSuccessfulCommand();
    const replayedCharacterId = testEngine.findCardInstanceId(
      replayedCharacter,
      "hand",
      "player_one",
    );
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [replayedCharacterId],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(replayedCharacter)).toBe("discard");

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(rapunzelFlynnRiderUnlikelyPair, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(replayedCharacter)).toBe("play");
  });
});
