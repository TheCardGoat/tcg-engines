import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { antonioMadrigalFriendToAll } from "./005-antonio-madrigal-friend-to-all";

const singer = createMockCharacter({
  id: "antonio-singer",
  name: "Singer Character",
  cost: 5,
});

const songToSing = createMockSong({
  id: "antonio-test-song",
  name: "Test Song",
  cost: 3,
  text: "A test song.",
});

const searchableCharacter = createMockCharacter({
  id: "antonio-searchable",
  name: "Searchable Character",
  cost: 3,
});

const tooExpensiveCharacter = createMockCharacter({
  id: "antonio-too-expensive",
  name: "Too Expensive Character",
  cost: 4,
});

const fillerCard = createMockCharacter({
  id: "antonio-filler",
  name: "Filler Card",
  cost: 5,
});

describe("Antonio Madrigal - Friend to All", () => {
  it("OF COURSE THEY CAN COME - searches deck for character with cost 3 or less when a character sings a song", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: antonioMadrigalFriendToAll, isDrying: false },
        { card: singer, isDrying: false },
      ],
      hand: [songToSing],
      deck: [tooExpensiveCharacter, searchableCharacter, fillerCard],
    });

    expect(testEngine.asPlayerOne().singSong(songToSing, singer)).toBeSuccessfulCommand();

    // The triggered ability should create a bag for the optional effect
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(antonioMadrigalFriendToAll, {
        resolveOptional: true,
        // search-deck auto-selects a matching card from the deck
      }),
    ).toBeSuccessfulCommand();

    // Searchable character (cost 3) should be in hand
    expect(testEngine.asPlayerOne().getCardZone(searchableCharacter)).toBe("hand");
    // Too expensive character (cost 4) should still be in deck
    expect(testEngine.asPlayerOne().getCardZone(tooExpensiveCharacter)).toBe("deck");
  });

  it("OF COURSE THEY CAN COME - triggers only once per turn", () => {
    const secondSinger = createMockCharacter({
      id: "antonio-second-singer",
      name: "Second Singer",
      cost: 5,
    });

    const secondSong = createMockSong({
      id: "antonio-second-song",
      name: "Second Song",
      cost: 3,
      text: "A second test song.",
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: antonioMadrigalFriendToAll, isDrying: false },
        { card: singer, isDrying: false },
        { card: secondSinger, isDrying: false },
      ],
      hand: [songToSing, secondSong],
      deck: [searchableCharacter, fillerCard],
    });

    // First song triggers the ability
    expect(testEngine.asPlayerOne().singSong(songToSing, singer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(antonioMadrigalFriendToAll, {
        resolveOptional: true,
        // search-deck auto-selects a matching card from the deck
      }),
    ).toBeSuccessfulCommand();

    // Second song should NOT trigger the ability (once per turn)
    expect(testEngine.asPlayerOne().singSong(secondSong, secondSinger)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("OF COURSE THEY CAN COME - can decline the optional search", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: antonioMadrigalFriendToAll, isDrying: false },
        { card: singer, isDrying: false },
      ],
      hand: [songToSing],
      deck: [searchableCharacter, fillerCard],
    });

    expect(testEngine.asPlayerOne().singSong(songToSing, singer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(antonioMadrigalFriendToAll, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    // Card should still be in deck
    expect(testEngine.asPlayerOne().getCardZone(searchableCharacter)).toBe("deck");
  });
});
