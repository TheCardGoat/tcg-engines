import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rightBehindYou } from "./064-right-behind-you";

const sevenDwarfCharacter = createMockCharacter({
  id: "rby-dwarf-in-play",
  name: "Doc",
  version: "Leader of the Seven Dwarfs",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
});

const princessCharacter = createMockCharacter({
  id: "rby-princess-in-play",
  name: "Snow White",
  version: "Fair-Hearted",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Princess"],
});

const dwarfInHand = createMockCharacter({
  id: "rby-dwarf-in-hand",
  name: "Grumpy",
  version: "Soreheaded Miner",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
});

const secondDwarfInHand = createMockCharacter({
  id: "rby-second-dwarf-in-hand",
  name: "Happy",
  version: "Joyful Adventurer",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
});

const nonDwarfInHand = createMockCharacter({
  id: "rby-non-dwarf-in-hand",
  name: "Generic Hero",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const deckTopCard = createMockCharacter({
  id: "rby-deck-top",
  name: "Deck Top",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Right Behind You", () => {
  it("draws a card and lets the controller play a Seven Dwarfs character for free when both a Seven Dwarfs and Princess character are in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rightBehindYou, dwarfInHand],
      inkwell: rightBehindYou.cost,
      play: [sevenDwarfCharacter, princessCharacter],
      deck: [deckTopCard],
    });

    expect(testEngine.asPlayerOne().playCard(rightBehindYou)).toBeSuccessfulCommand();

    // Card was drawn
    expect(testEngine.asPlayerOne().getCardZone(deckTopCard)).toBe("hand");

    // Resolve the optional play-for-free with the Seven Dwarfs character in hand
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(rightBehindYou, {
        resolveOptional: true,
        targets: [dwarfInHand],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(dwarfInHand)).toBe("play");
  });

  it("draws a card but does not offer the play-for-free when conditions are not met (no Princess in play)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rightBehindYou, dwarfInHand],
      inkwell: rightBehindYou.cost,
      play: [sevenDwarfCharacter],
      deck: [deckTopCard],
    });

    expect(testEngine.asPlayerOne().playCard(rightBehindYou)).toBeSuccessfulCommand();

    // Card was drawn
    expect(testEngine.asPlayerOne().getCardZone(deckTopCard)).toBe("hand");

    // The Seven Dwarfs in hand should remain in hand because the conditional did not trigger
    expect(testEngine.asPlayerOne().getCardZone(dwarfInHand)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(rightBehindYou)).toBe("discard");
  });

  it("presents a card-selection prompt with all Seven Dwarfs candidates when multiple are in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rightBehindYou, dwarfInHand, secondDwarfInHand],
      inkwell: rightBehindYou.cost,
      play: [sevenDwarfCharacter, princessCharacter],
      deck: [deckTopCard],
    });

    expect(testEngine.asPlayerOne().playCard(rightBehindYou)).toBeSuccessfulCommand();

    // Card was drawn
    expect(testEngine.asPlayerOne().getCardZone(deckTopCard)).toBe("hand");

    // A pending effect with a hand-selection prompt must be present
    const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
    expect(pendingEffects).toHaveLength(1);

    const [pendingEffect] = pendingEffects;
    expect(pendingEffect?.selectionContext?.kind).toBe("target-selection");
    const selectionCtx = pendingEffect?.selectionContext as
      | { allowedZones?: string[]; cardCandidateIds?: string[] }
      | undefined;
    expect(selectionCtx?.allowedZones).toContain("hand");

    const dwarf1Id = testEngine.findCardInstanceId(dwarfInHand, "hand", "player_one");
    const dwarf2Id = testEngine.findCardInstanceId(secondDwarfInHand, "hand", "player_one");

    // Both Dwarfs must appear as candidates
    const candidateIds = selectionCtx?.cardCandidateIds ?? [];
    expect(candidateIds).toContain(dwarf1Id);
    expect(candidateIds).toContain(dwarf2Id);

    // Player selects the second Dwarf
    expect(
      testEngine.asPlayerOne().resolveEffect(pendingEffect!.id, {
        resolveOptional: true,
        targets: [dwarf2Id],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(secondDwarfInHand)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(dwarfInHand)).toBe("hand");
  });

  it("only lets the controller play a Seven Dwarfs character (not a non-Seven Dwarfs) when the conditional is met", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rightBehindYou, nonDwarfInHand],
      inkwell: rightBehindYou.cost,
      play: [sevenDwarfCharacter, princessCharacter],
      deck: [deckTopCard],
    });

    expect(testEngine.asPlayerOne().playCard(rightBehindYou)).toBeSuccessfulCommand();

    // Card was drawn
    expect(testEngine.asPlayerOne().getCardZone(deckTopCard)).toBe("hand");

    // Decline the optional — non-Seven-Dwarfs character should not be playable for free
    testEngine.asPlayerOne().resolvePendingByCard(rightBehindYou, {
      resolveOptional: false,
    });

    expect(testEngine.asPlayerOne().getCardZone(nonDwarfInHand)).toBe("hand");
  });
});
