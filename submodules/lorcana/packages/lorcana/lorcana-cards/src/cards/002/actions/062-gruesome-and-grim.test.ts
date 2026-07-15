import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gruesomeAndGrim } from "./062-gruesome-and-grim";

const summonedCharacter = createMockCharacter({
  id: "gruesome-and-grim-summoned-character",
  name: "Summoned Character",
  cost: 4,
  strength: 3,
  willpower: 4,
});

const oversizedCharacter = createMockCharacter({
  id: "gruesome-and-grim-oversized-character",
  name: "Oversized Character",
  cost: 5,
  strength: 4,
  willpower: 4,
});

const exertedDefender = createMockCharacter({
  id: "gruesome-and-grim-exerted-defender",
  name: "Exerted Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Gruesome and Grim", () => {
  it("plays a cost 4 or less character for free, lets them challenge right away, and banishes them at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [gruesomeAndGrim, summonedCharacter],
        inkwell: gruesomeAndGrim.cost,
        deck: 2,
      },
      {
        play: [{ card: exertedDefender, exerted: true, isDrying: false }],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(gruesomeAndGrim, {
        targets: [testEngine.findCardInstanceId(summonedCharacter, "hand", "p1")],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(summonedCharacter)).toBe("play");
    expect(testEngine.hasKeyword(summonedCharacter, "Rush")).toBe(true);
    expect(testEngine.asPlayerOne().canChallenge(summonedCharacter, exertedDefender)).toBe(true);
    expect(
      testEngine.asPlayerOne().challenge(summonedCharacter, exertedDefender),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(summonedCharacter)).toBe("discard");
  });

  it("does not let you choose a character with cost 5 or more", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [gruesomeAndGrim, oversizedCharacter],
      inkwell: gruesomeAndGrim.cost,
    });

    const result = testEngine.asPlayerOne().playCard(gruesomeAndGrim, {
      targets: [testEngine.findCardInstanceId(oversizedCharacter, "hand", "p1")],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(oversizedCharacter)).toBe("hand");
  });
});
