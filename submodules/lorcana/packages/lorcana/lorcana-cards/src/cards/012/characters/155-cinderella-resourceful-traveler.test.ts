import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaKingInTheMaking } from "../../010";
import { cinderellaResourcefulTraveler } from "./155-cinderella-resourceful-traveler";

const anotherCharacter = createMockCharacter({
  id: "cinderella-ally",
  name: "Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const boostedUnderCard = createMockCharacter({
  id: "cinderella-boosted-under-card",
  name: "Boosted Under Card",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const timelyAllianceCharacter = createMockCharacter({
  id: "cinderella-timely-alliance-character",
  name: "Timely Alliance Character",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const inkwellTopDeckCard = createMockCharacter({
  id: "cinderella-inkwell-top-deck-card",
  name: "Inkwell Top Deck Card",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Cinderella - Resourceful Traveler", () => {
  it("THIS AND THAT - puts top card of deck into inkwell when questing after playing another character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [anotherCharacter],
        play: [cinderellaResourcefulTraveler],
        inkwell: 1,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();

    const inkwellBefore = testEngine.asPlayerOne().getZonesCardCount().inkwell;
    const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

    expect(testEngine.asPlayerOne().quest(cinderellaResourcefulTraveler)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(cinderellaResourcefulTraveler, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(inkwellBefore + 1);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(deckBefore - 1);
  });

  it("regression: counts a character played for free from Simba's Timely Alliance", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [simbaKingInTheMaking, { card: cinderellaResourcefulTraveler, isDrying: false }],
        inkwell: 3,
        deck: [inkwellTopDeckCard, timelyAllianceCharacter, boostedUnderCard],
      },
      {
        deck: 5,
      },
    );

    const playerOne = testEngine.asPlayerOne();

    expect(playerOne.activateAbility(simbaKingInTheMaking, "Boost 3")).toBeSuccessfulCommand();
    expect(
      playerOne.resolvePendingByCard(simbaKingInTheMaking, {
        resolveOptional: true,
        destinations: [{ zone: "play", cards: [timelyAllianceCharacter] }],
      }),
    ).toBeSuccessfulCommand();
    expect(playerOne.getCardZone(timelyAllianceCharacter)).toBe("play");

    const inkwellBefore = playerOne.getZonesCardCount().inkwell;

    expect(playerOne.quest(cinderellaResourcefulTraveler)).toBeSuccessfulCommand();
    expect(playerOne.getBagCount()).toBe(1);
    expect(
      playerOne.resolvePendingByCard(cinderellaResourcefulTraveler, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(playerOne.getZonesCardCount().inkwell).toBe(inkwellBefore + 1);
    expect(playerOne.getCardZone(inkwellTopDeckCard)).toBe("inkwell");
  });
});
