import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { pizzaPlanetSpaceport } from "./102-pizza-planet-spaceport";

const toyCharacter = createMockCharacter({
  id: "pizza-planet-toy",
  name: "Toy Ranger",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Toy"],
});

const nonToyCharacter = createMockCharacter({
  id: "pizza-planet-non-toy",
  name: "Regular Visitor",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn"],
});

const attacker = createMockCharacter({
  id: "pizza-planet-attacker",
  name: "Pizza Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Pizza Planet - Spaceport", () => {
  it("YOU ARE CLEAR TO ENTER - Toy characters can move here for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pizzaPlanetSpaceport, toyCharacter],
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(toyCharacter, pizzaPlanetSpaceport).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCardLocationId(toyCharacter)).toBe(
      testEngine.findCardInstanceId(pizzaPlanetSpaceport, "play", "p1"),
    );
  });

  it("YOU ARE CLEAR TO ENTER - non-Toy characters must pay move cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pizzaPlanetSpaceport, nonToyCharacter],
    });

    // No ink available, non-Toy character should not be able to move
    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(nonToyCharacter, pizzaPlanetSpaceport)
        .success,
    ).toBe(false);
  });

  it("YOU ARE CLEAR TO ENTER - non-Toy characters can move with ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pizzaPlanetSpaceport, nonToyCharacter],
      inkwell: 2,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(nonToyCharacter, pizzaPlanetSpaceport)
        .success,
    ).toBe(true);
  });

  it("HEAVILY GUARDED - each opponent loses 1 lore when a character here is challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          pizzaPlanetSpaceport,
          { card: toyCharacter, atLocation: pizzaPlanetSpaceport, exerted: true },
        ],
      },
      {
        play: [attacker],
      },
      {
        startingLore: { [PLAYER_ONE]: 0, [PLAYER_TWO]: 2 },
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(attacker, toyCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(pizzaPlanetSpaceport).success).toBe(true);

    expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(1);
  });
});
