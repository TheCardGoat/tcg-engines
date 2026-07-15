import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { whiteRabbitsPocketWatch } from "./066-white-rabbits-pocket-watch";

const hurriedHero = createMockCharacter({
  id: "white-rabbits-pocket-watch-hero",
  name: "Hurried Hero",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const waitingDefender = createMockCharacter({
  id: "white-rabbits-pocket-watch-defender",
  name: "Waiting Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("White Rabbit's Pocket Watch", () => {
  it("gives the chosen character Rush this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [whiteRabbitsPocketWatch, { card: hurriedHero, isDrying: true }],
      },
      {
        play: [{ card: waitingDefender, exerted: true, isDrying: false }],
      },
    );

    expect(testEngine.asPlayerOne().canChallenge(hurriedHero, waitingDefender)).toBe(false);

    expect(
      testEngine.asPlayerOne().activateAbility(whiteRabbitsPocketWatch, {
        targets: [hurriedHero],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(hurriedHero, "Rush")).toBe(true);
    expect(testEngine.asPlayerOne().canChallenge(hurriedHero, waitingDefender)).toBe(true);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(hurriedHero, "Rush")).toBe(false);
  });
});
