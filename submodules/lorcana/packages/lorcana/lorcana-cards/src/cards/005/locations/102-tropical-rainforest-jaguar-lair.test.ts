import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tropicalRainforestJaguarLair } from "./102-tropical-rainforest-jaguar-lair";

const damagedOpponent = createMockCharacter({
  id: "jaguar-damaged",
  name: "Damaged Opponent",
  cost: 2,
});
const healthyOpponent = createMockCharacter({
  id: "jaguar-healthy",
  name: "Healthy Opponent",
  cost: 2,
});
const damagedFriendly = createMockCharacter({
  id: "jaguar-friendly-damaged",
  name: "Damaged Friendly",
  cost: 2,
});

describe("Tropical Rainforest - Jaguar Lair", () => {
  it("gives Reckless only to opposing damaged characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [tropicalRainforestJaguarLair],
      },
      {
        play: [{ card: damagedOpponent, damage: 1 }, healthyOpponent],
      },
    );

    expect(testEngine.asPlayerTwo().hasKeyword(damagedOpponent, "Reckless")).toBe(true);
    expect(testEngine.asPlayerTwo().hasKeyword(healthyOpponent, "Reckless")).toBe(false);
  });

  it("does not give Reckless to the controller's own damaged characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [tropicalRainforestJaguarLair, { card: damagedFriendly, damage: 1 }],
      },
      {
        play: [],
      },
    );

    expect(testEngine.asPlayerOne().hasKeyword(damagedFriendly, "Reckless")).toBe(false);
  });

  it("opposing damaged character with static-granted Reckless cannot quest", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [tropicalRainforestJaguarLair],
        deck: 1,
      },
      {
        play: [{ card: damagedOpponent, damage: 1 }],
        deck: 1,
      },
    );

    // Confirm Reckless is granted statically
    expect(testEngine.asPlayerTwo().hasKeyword(damagedOpponent, "Reckless")).toBe(true);

    // Pass turn so it's player two's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Damaged opponent cannot quest because it has Reckless from the static effect
    expect(testEngine.asPlayerTwo().quest(damagedOpponent).success).toBe(false);
  });
});
