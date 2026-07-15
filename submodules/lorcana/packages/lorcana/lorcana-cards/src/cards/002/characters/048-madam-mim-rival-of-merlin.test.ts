import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { madamMimRivalOfMerlin } from "./048-madam-mim-rival-of-merlin";

const summonedCharacter = createMockCharacter({
  id: "madam-mim-summoned-character",
  name: "Summoned Character",
  cost: 4,
  strength: 3,
  willpower: 4,
});

const oversizedCharacter = createMockCharacter({
  id: "madam-mim-oversized-character",
  name: "Oversized Character",
  cost: 5,
  strength: 4,
  willpower: 4,
});

const exertedDefender = createMockCharacter({
  id: "madam-mim-exerted-defender",
  name: "Exerted Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Madam Mim - Rival of Merlin", () => {
  it("has Shift keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [madamMimRivalOfMerlin],
    });

    expect(testEngine.hasKeyword(madamMimRivalOfMerlin, "Shift")).toBe(true);
  });

  it("plays a cost 4 or less character for free, gives them Rush, and banishes them at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [summonedCharacter],
        inkwell: 3,
        play: [madamMimRivalOfMerlin],
        deck: 2,
      },
      {
        play: [{ card: exertedDefender, exerted: true, isDrying: false }],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(madamMimRivalOfMerlin, {
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
      hand: [oversizedCharacter],
      inkwell: 3,
      play: [madamMimRivalOfMerlin],
    });

    const result = testEngine.asPlayerOne().activateAbility(madamMimRivalOfMerlin, {
      targets: [testEngine.findCardInstanceId(oversizedCharacter, "hand", "p1")],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(oversizedCharacter)).toBe("hand");
  });
});
