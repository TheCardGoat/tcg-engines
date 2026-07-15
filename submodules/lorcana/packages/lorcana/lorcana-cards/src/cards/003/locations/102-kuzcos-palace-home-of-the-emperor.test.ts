import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kuzcosPalaceHomeOfTheEmperor } from "./102-kuzcos-palace-home-of-the-emperor";

const palaceDefender = createMockCharacter({
  id: "palace-defender",
  name: "Palace Defender",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const palaceAttacker = createMockCharacter({
  id: "palace-attacker",
  name: "Palace Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Kuzco's Palace - Home of the Emperor", () => {
  it("banishes the challenging character when a character here is banished in the challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          kuzcosPalaceHomeOfTheEmperor,
          { card: palaceDefender, atLocation: kuzcosPalaceHomeOfTheEmperor, exerted: true },
        ],
      },
      {
        play: [palaceAttacker],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(palaceAttacker, palaceDefender),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(palaceDefender)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(palaceAttacker)).toBe("play");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(kuzcosPalaceHomeOfTheEmperor),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(palaceAttacker)).toBe("discard");
  });
});
