import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cardSoldiersRoyalTroops } from "./129-card-soldiers-royal-troops";

const opponentCharacter = createMockCharacter({
  id: "test-opponent-char",
  name: "Test Opponent Character",
  cost: 3,
  strength: 3,
  willpower: 5,
});

describe("Card Soldiers - Royal Troops", () => {
  it("TAKE POINT - base strength without damaged characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: cardSoldiersRoyalTroops }],
    });

    const cardSoldiersId = testEngine.findCardInstanceId(cardSoldiersRoyalTroops, "play");

    // Without any damaged characters, strength should be base value (1)
    expect(testEngine.asServer().getCard(cardSoldiersId).strength).toBe(
      cardSoldiersRoyalTroops.strength,
    );
  });

  it("TAKE POINT - gains +2 strength while a damaged character is in play (opponent)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: cardSoldiersRoyalTroops }],
      },
      {
        play: [{ card: opponentCharacter, damage: 1 }],
      },
    );

    const cardSoldiersId = testEngine.findCardInstanceId(cardSoldiersRoyalTroops, "play");

    // With a damaged character in play, strength should be base + 2
    expect(testEngine.asServer().getCard(cardSoldiersId).strength).toBe(
      cardSoldiersRoyalTroops.strength + 2,
    );
  });

  it("TAKE POINT - gains +2 strength while a damaged character is in play (own)", () => {
    const allyCharacter = createMockCharacter({
      id: "test-ally-char",
      name: "Test Ally Character",
      cost: 2,
      strength: 2,
      willpower: 4,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: cardSoldiersRoyalTroops }, { card: allyCharacter, damage: 1 }],
    });

    const cardSoldiersId = testEngine.findCardInstanceId(cardSoldiersRoyalTroops, "play");

    // With a damaged ally character in play, strength should be base + 2
    expect(testEngine.asServer().getCard(cardSoldiersId).strength).toBe(
      cardSoldiersRoyalTroops.strength + 2,
    );
  });

  it("regression: gains +2 strength when any damaged character is in play", () => {
    // Bug: Card Soldiers was not gaining +2 strength when a damaged character was in play.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: cardSoldiersRoyalTroops }],
      },
      {
        play: [{ card: opponentCharacter, damage: 2 }],
      },
    );

    const cardSoldiersId = testEngine.findCardInstanceId(cardSoldiersRoyalTroops, "play");

    // With a damaged opponent character in play, strength should be base + 2
    expect(testEngine.asServer().getCard(cardSoldiersId).strength).toBe(
      cardSoldiersRoyalTroops.strength + 2,
    );
  });
});
