import { describe, expect, it } from "bun:test";
import { CANONICAL_PLAYER_ONE } from "@tcg/shared/testing";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { whiteRabbitsPocketWatch } from "./068-white-rabbits-pocket-watch";

const freshAttacker = createMockCharacter({
  id: "white-rabbits-pocket-watch-attacker",
  name: "Fresh Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const exertedDefender = createMockCharacter({
  id: "white-rabbits-pocket-watch-defender",
  name: "Exerted Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("White Rabbit's Pocket Watch", () => {
  it("costs 1 ink and exertion to give the chosen character Rush this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        deck: 1,
        play: [whiteRabbitsPocketWatch, { card: freshAttacker, isDrying: true }],
      },
      {
        deck: 1,
        play: [{ card: exertedDefender, exerted: true, isDrying: false }],
      },
    );

    expect(testEngine.asPlayerOne().canChallenge(freshAttacker, exertedDefender)).toBe(false);
    expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(1);

    expect(
      testEngine.asPlayerOne().activateAbility(whiteRabbitsPocketWatch, {
        targets: [freshAttacker],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(whiteRabbitsPocketWatch)).toBe(true);
    expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().hasKeyword(freshAttacker, "Rush")).toBe(true);
    expect(testEngine.asPlayerOne().canChallenge(freshAttacker, exertedDefender)).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(freshAttacker, "Rush")).toBe(false);
  });
});
