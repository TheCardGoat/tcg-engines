import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { youveGotAFriendInMeEnchanted } from "./225-youve-got-a-friend-in-me-enchanted";

const toyCharacterA = createMockCharacter({
  id: "yougotfriend-toy-a",
  name: "Toy A",
  cost: 2,
  classifications: ["Storyborn", "Toy"],
});

const toyCharacterB = createMockCharacter({
  id: "yougotfriend-toy-b",
  name: "Toy B",
  cost: 3,
  classifications: ["Storyborn", "Toy"],
});

const nonToyCharacter = createMockCharacter({
  id: "yougotfriend-non-toy",
  name: "Non-Toy",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

const filler = createMockCharacter({
  id: "yougotfriend-filler",
  name: "Filler",
  cost: 1,
  classifications: ["Storyborn", "Ally"],
});

describe("You've Got a Friend in Me - Enchanted", () => {
  it("reveals up to 2 Toy characters and puts them into hand, with the rest on the bottom of the deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [youveGotAFriendInMeEnchanted],
      inkwell: youveGotAFriendInMeEnchanted.cost,
      deck: [toyCharacterA, toyCharacterB, nonToyCharacter, filler],
    });

    expect(
      testEngine.asPlayerOne().playCard(youveGotAFriendInMeEnchanted, {
        destinations: [
          {
            zone: "hand",
            cards: [toyCharacterA, toyCharacterB],
          },
          {
            zone: "deck-bottom",
            cards: [nonToyCharacter, filler],
          },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(toyCharacterA)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(toyCharacterB)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(nonToyCharacter)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(filler)).toBe("deck");

    const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
    // Both non-hand cards should be on the bottom (last two slots) of the deck.
    expect(deckIds.slice(-2).sort()).toEqual([nonToyCharacter.id, filler.id].sort());
  });

  it("rejects revealing a non-Toy character to the Toy destination", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [youveGotAFriendInMeEnchanted],
      inkwell: youveGotAFriendInMeEnchanted.cost,
      deck: [toyCharacterA, nonToyCharacter, filler, toyCharacterB],
    });

    expect(testEngine.asPlayerOne().playCard(youveGotAFriendInMeEnchanted)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    // Attempting to put a non-Toy character into hand should be rejected.
    expect(
      testEngine.asPlayerOne().resolvePendingEffect(youveGotAFriendInMeEnchanted, {
        destinations: [
          {
            zone: "hand",
            cards: [nonToyCharacter],
          },
          {
            zone: "deck-bottom",
            cards: [toyCharacterA, toyCharacterB, filler],
          },
        ],
      }).success,
    ).toBe(false);

    // Still pending.
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
  });

  it("allows revealing zero Toys and sending all looked-at cards to the bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [youveGotAFriendInMeEnchanted],
      inkwell: youveGotAFriendInMeEnchanted.cost,
      deck: [toyCharacterA, toyCharacterB, nonToyCharacter, filler],
    });

    expect(
      testEngine.asPlayerOne().playCard(youveGotAFriendInMeEnchanted, {
        destinations: [
          {
            zone: "hand",
            cards: [],
          },
          {
            zone: "deck-bottom",
            cards: [toyCharacterA, toyCharacterB, nonToyCharacter, filler],
          },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(toyCharacterA)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(toyCharacterB)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(nonToyCharacter)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(filler)).toBe("deck");
  });
});
