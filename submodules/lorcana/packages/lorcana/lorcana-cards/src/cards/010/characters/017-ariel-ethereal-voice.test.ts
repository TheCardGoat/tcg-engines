import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
  createMockSong,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { arielEtherealVoice } from "./017-ariel-ethereal-voice";

const underCard = createMockCharacter({
  id: "ariel-ethereal-voice-under-card",
  name: "Under Card",
  cost: 1,
});

const firstDrawnCard = createMockCharacter({
  id: "ariel-ethereal-voice-first-drawn-card",
  name: "First Drawn Card",
  cost: 1,
});

const secondDrawnCard = createMockCharacter({
  id: "ariel-ethereal-voice-second-drawn-card",
  name: "Second Drawn Card",
  cost: 1,
});

const firstSong = createMockSong({
  id: "ariel-ethereal-voice-first-song",
  name: "First Song",
  cost: 1,
  text: "A test song.",
});

const secondSong = createMockSong({
  id: "ariel-ethereal-voice-second-song",
  name: "Second Song",
  cost: 1,
  text: "Another test song.",
});

describe("Ariel - Ethereal Voice", () => {
  it("has Boost 1", () => {
    const testEngine = new LorcanaTestEngine({
      play: [arielEtherealVoice],
    });

    expect(testEngine.getCardModel(arielEtherealVoice).hasBoost()).toBe(true);
  });

  it("draws only once during your turn when you play songs while a card is under it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: arielEtherealVoice, cardsUnder: [underCard] }],
      hand: [firstSong, secondSong],
      inkwell: firstSong.cost + secondSong.cost,
      deck: [secondDrawnCard, firstDrawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(arielEtherealVoice, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(firstDrawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2 });

    expect(testEngine.asPlayerOne().playCard(secondSong)).toBeSuccessfulCommand();
    // Once-per-turn: the trigger should not fire again
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(secondDrawnCard)).toBe("deck");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1 });
  });

  it("does not trigger when there is no card under this character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arielEtherealVoice],
      hand: [firstSong],
      inkwell: firstSong.cost,
      deck: [firstDrawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    // Board-state condition is checked at trigger time, ability is not queued when condition is false.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(firstDrawnCard)).toBe("deck");
  });

  it("does not trigger when a non-song action is played", () => {
    const nonSongAction = createMockAction({
      id: "ariel-ethereal-voice-non-song-action",
      name: "Non-Song Action",
      cost: 1,
      text: "A regular action.",
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: arielEtherealVoice, cardsUnder: [underCard] }],
      hand: [nonSongAction],
      inkwell: nonSongAction.cost,
      deck: [firstDrawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(nonSongAction)).toBeSuccessfulCommand();
    // Non-song action should NOT trigger COMMAND PERFORMANCE
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(firstDrawnCard)).toBe("deck");
  });

  it("allows declining the optional draw", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: arielEtherealVoice, cardsUnder: [underCard] }],
      hand: [firstSong],
      inkwell: firstSong.cost,
      deck: [firstDrawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(arielEtherealVoice, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(firstDrawnCard)).toBe("deck");
  });
});
