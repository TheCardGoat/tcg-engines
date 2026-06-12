import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dontBeNervous } from "./065-dont-be-nervous";

const princessInDeck = createMockCharacter({
  id: "dbn-princess-deck",
  name: "Snow White",
  version: "Fair-Hearted",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Princess"],
});

const nonPrincessInDeck = createMockCharacter({
  id: "dbn-non-princess-deck",
  name: "Filler",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const dwarfA = createMockCharacter({
  id: "dbn-dwarf-a",
  name: "Doc",
  version: "Leader of the Seven Dwarfs",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
});

const dwarfB = createMockCharacter({
  id: "dbn-dwarf-b",
  name: "Grumpy",
  version: "Bad-Tempered",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
});

const deckFiller1 = createMockCharacter({
  id: "dbn-filler-1",
  name: "Filler 1",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const deckFiller2 = createMockCharacter({
  id: "dbn-filler-2",
  name: "Filler 2",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Don't Be Nervous", () => {
  it("searches the deck for a Princess, puts it in hand, shuffles, and when 2+ Seven Dwarfs are in play, draws 2 and gains 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dontBeNervous],
      inkwell: dontBeNervous.cost,
      play: [dwarfA, dwarfB],
      deck: [nonPrincessInDeck, princessInDeck, deckFiller1, deckFiller2],
    });

    const playerOne = testEngine.asPlayerOne();
    const loreBefore = testEngine.getLore("player_one");
    const handBefore = testEngine.getCardInstanceIdsInZone("hand", "player_one").length;

    expect(playerOne.playCard(dontBeNervous)).toBeSuccessfulCommand();

    // Princess fetched into hand
    expect(playerOne.getCardZone(princessInDeck)).toBe("hand");

    // Before: hand had [dontBeNervous]. After: dontBeNervous in discard,
    // +1 Princess fetched, +2 drawn = hand size = handBefore - 1 + 1 + 2 = handBefore + 2
    const handAfter = testEngine.getCardInstanceIdsInZone("hand", "player_one").length;
    expect(handAfter).toBe(handBefore + 2);

    expect(testEngine.getLore("player_one")).toBe(loreBefore + 2);
  });

  it("does not draw or gain lore when fewer than 2 Seven Dwarfs are in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dontBeNervous],
      inkwell: dontBeNervous.cost,
      play: [dwarfA],
      deck: [nonPrincessInDeck, princessInDeck, deckFiller1, deckFiller2],
    });

    const playerOne = testEngine.asPlayerOne();
    const loreBefore = testEngine.getLore("player_one");
    const handBefore = testEngine.getCardInstanceIdsInZone("hand", "player_one").length;

    expect(playerOne.playCard(dontBeNervous)).toBeSuccessfulCommand();

    // Princess fetched into hand
    expect(playerOne.getCardZone(princessInDeck)).toBe("hand");

    // No extra draws: hand size = handBefore - 1 (played) + 1 (princess) = handBefore
    const handAfter = testEngine.getCardInstanceIdsInZone("hand", "player_one").length;
    expect(handAfter).toBe(handBefore);

    // No lore gain
    expect(testEngine.getLore("player_one")).toBe(loreBefore);
  });
});
