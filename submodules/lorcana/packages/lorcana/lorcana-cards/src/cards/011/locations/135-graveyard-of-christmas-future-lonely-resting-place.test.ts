import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { graveyardOfChristmasFutureLonelyRestingPlace } from "./135-graveyard-of-christmas-future-lonely-resting-place";

const graveyardResident = createMockCharacter({
  id: "graveyard-resident",
  name: "Graveyard Resident",
  cost: 2,
});

const topDeckCard = createMockCharacter({
  id: "graveyard-top-deck",
  name: "Graveyard Top Deck",
  cost: 1,
});

const backupDeckCard = createMockCharacter({
  id: "graveyard-backup-deck",
  name: "Graveyard Backup Deck",
  cost: 1,
});

const thirdDeckCard = createMockCharacter({
  id: "graveyard-third-deck",
  name: "Graveyard Third Deck",
  cost: 1,
});

describe("Graveyard of Christmas Future - Lonely Resting Place", () => {
  it("is playable as a location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [graveyardOfChristmasFutureLonelyRestingPlace],
      inkwell: graveyardOfChristmasFutureLonelyRestingPlace.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(graveyardOfChristmasFutureLonelyRestingPlace),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(graveyardOfChristmasFutureLonelyRestingPlace)).toBe(
      "play",
    );
  });

  it("puts the top card of your deck under it when a character moves here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [graveyardOfChristmasFutureLonelyRestingPlace, graveyardResident],
      inkwell: graveyardOfChristmasFutureLonelyRestingPlace.moveCost,
      deck: [backupDeckCard, topDeckCard],
    });

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(graveyardResident, graveyardOfChristmasFutureLonelyRestingPlace),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCardsUnder(graveyardOfChristmasFutureLonelyRestingPlace)).toHaveLength(1);
  });

  it("returns the stored deck card to your hand at the start of your turn, then banishes itself", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [graveyardOfChristmasFutureLonelyRestingPlace, graveyardResident],
      inkwell: graveyardOfChristmasFutureLonelyRestingPlace.moveCost,
      deck: [backupDeckCard, thirdDeckCard, topDeckCard],
    });

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(graveyardResident, graveyardOfChristmasFutureLonelyRestingPlace),
    ).toBeSuccessfulCommand();
    expect(testEngine.getCardsUnder(graveyardOfChristmasFutureLonelyRestingPlace)).toHaveLength(1);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(graveyardOfChristmasFutureLonelyRestingPlace, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCardsUnder(graveyardOfChristmasFutureLonelyRestingPlace)).toHaveLength(0);
    expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(graveyardOfChristmasFutureLonelyRestingPlace)).toBe(
      "discard",
    );
  });

  it("keeps the stored cards under it when you decline another chance", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [graveyardOfChristmasFutureLonelyRestingPlace, graveyardResident],
      inkwell: graveyardOfChristmasFutureLonelyRestingPlace.moveCost,
      deck: [backupDeckCard, thirdDeckCard, topDeckCard],
    });

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(graveyardResident, graveyardOfChristmasFutureLonelyRestingPlace),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(graveyardOfChristmasFutureLonelyRestingPlace, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCardsUnder(graveyardOfChristmasFutureLonelyRestingPlace)).toHaveLength(1);
    expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).not.toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(graveyardOfChristmasFutureLonelyRestingPlace)).toBe(
      "play",
    );
  });
});
