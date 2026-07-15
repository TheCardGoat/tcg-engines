import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { bobbyPurplePigeon } from "./182-bobby-purple-pigeon";

const challenger = createMockCharacter({
  id: "bobby-purple-pigeon-challenger",
  name: "Challenger",
  cost: 2,
  strength: 4,
  willpower: 4,
});

const protectedCharacter = createMockCharacter({
  id: "bobby-purple-pigeon-protected-character",
  name: "Protected Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Bobby - Purple Pigeon", () => {
  it("can enter play exerted because of Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bobbyPurplePigeon],
      inkwell: bobbyPurplePigeon.cost,
    });

    expect(
      testEngine.asPlayerOne().playCardOptional(bobbyPurplePigeon, true),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(bobbyPurplePigeon)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(bobbyPurplePigeon)).toBe(true);
  });

  it("must be challenged before other characters if able", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: bobbyPurplePigeon, exerted: true },
          { card: protectedCharacter, exerted: true },
        ],
      },
      {
        play: [challenger],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().canChallenge(challenger, protectedCharacter)).toBe(false);
    expect(testEngine.asPlayerTwo().canChallenge(challenger, bobbyPurplePigeon)).toBe(true);
  });
});
