import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rescueRangersSubmarineMobileHeadquarters } from "./169-rescue-rangers-submarine-mobile-headquarters";

const submarineResident = createMockCharacter({
  id: "submarine-resident",
  name: "Submarine Resident",
  cost: 2,
});

const topDeckCard = createMockCharacter({
  id: "submarine-top-deck",
  name: "Top Deck Card",
  cost: 2,
});

describe("Rescue Rangers Submarine - Mobile Headquarters", () => {
  it("may put the top card of your deck into your inkwell facedown and exerted at the start of your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          rescueRangersSubmarineMobileHeadquarters,
          { card: submarineResident, atLocation: rescueRangersSubmarineMobileHeadquarters },
        ],
        deck: [topDeckCard],
      },
      {
        deck: 2,
      },
    );
    const topDeckId = testEngine.findCardInstanceId(topDeckCard, "deck", "player_one");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(rescueRangersSubmarineMobileHeadquarters)
        .success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("inkwell");
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[topDeckId]?.publicFaceState,
    ).toBe("faceDown");
    expect(testEngine.asServer().getCard(topDeckId)?.exerted).toBe(true);
  });
});
