import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gastonArrogantHunter } from "./110-gaston-arrogant-hunter";

const opposingCharacter = createMockCharacter({
  id: "gaston-arrogant-hunter-opponent",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Gaston - Arrogant Hunter", () => {
  it("cannot quest and must challenge if able", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [gastonArrogantHunter], deck: 2 },
      { play: [{ card: opposingCharacter, exerted: true, isDrying: false }], deck: 2 },
    );

    expect(testEngine.asPlayerOne().quest(gastonArrogantHunter)).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).not.toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().challenge(gastonArrogantHunter, opposingCharacter),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });

  it("has the printed keyword abilities", () => {
    expect(gastonArrogantHunter.abilities?.some((ability) => ability.type === "keyword")).toBe(
      true,
    );
    expect(
      gastonArrogantHunter.abilities?.find((ability) => ability.type === "keyword"),
    ).toMatchObject({
      keyword: "Reckless",
    });
  });
});
