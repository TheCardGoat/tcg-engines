import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { arielEtherealVoiceIconic } from "./241-ariel-ethereal-voice-iconic";

const underCard = createMockCharacter({
  id: "ariel-iconic-under-card",
  name: "Under Card",
  cost: 1,
});

const firstDrawnCard = createMockCharacter({
  id: "ariel-iconic-first-drawn-card",
  name: "First Drawn Card",
  cost: 1,
});

const secondDrawnCard = createMockCharacter({
  id: "ariel-iconic-second-drawn-card",
  name: "Second Drawn Card",
  cost: 1,
});

const firstSong = createMockSong({
  id: "ariel-iconic-first-song",
  name: "First Song",
  cost: 1,
  text: "A test song.",
});

const secondSong = createMockSong({
  id: "ariel-iconic-second-song",
  name: "Second Song",
  cost: 1,
  text: "Another test song.",
});

describe("Ariel - Ethereal Voice (Iconic)", () => {
  it("has Boost 1", () => {
    const testEngine = new LorcanaTestEngine({
      play: [arielEtherealVoiceIconic],
    });

    expect(testEngine.getCardModel(arielEtherealVoiceIconic).hasBoost()).toBe(true);
  });

  it("draws a card when you play a song while a card is under it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: arielEtherealVoiceIconic, cardsUnder: [underCard] }],
      hand: [firstSong],
      inkwell: firstSong.cost,
      deck: [firstDrawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(arielEtherealVoiceIconic, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(firstDrawnCard)).toBe("hand");
  });

  it("draws only once during your turn when you play multiple songs", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: arielEtherealVoiceIconic, cardsUnder: [underCard] }],
      hand: [firstSong, secondSong],
      inkwell: firstSong.cost + secondSong.cost,
      deck: [secondDrawnCard, firstDrawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(arielEtherealVoiceIconic, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(firstDrawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2 });

    expect(testEngine.asPlayerOne().playCard(secondSong)).toBeSuccessfulCommand();
    // Once per turn - the trigger should not fire again
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(secondDrawnCard)).toBe("deck");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1 });
  });

  it("does not trigger if no card is under the character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arielEtherealVoiceIconic],
      hand: [firstSong],
      inkwell: firstSong.cost,
      deck: [firstDrawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    // Board-state condition is checked at trigger time, ability is not queued when condition is false.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
