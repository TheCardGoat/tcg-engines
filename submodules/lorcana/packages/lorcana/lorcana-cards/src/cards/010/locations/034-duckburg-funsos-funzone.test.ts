import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { duckburgFunsosFunzone } from "./034-duckburg-funsos-funzone";

const funzoneQuester = createMockCharacter({
  id: "funzone-quester",
  name: "Funzone Quester",
  cost: 2,
  lore: 1,
});

const discountedCharacter = createMockCharacter({
  id: "funzone-discounted-character",
  name: "Discounted Character",
  cost: 5,
});

describe("Duckburg - Funso's Funzone", () => {
  it("reduces the cost of the next character you play after a character quests here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [duckburgFunsosFunzone, { card: funzoneQuester, atLocation: duckburgFunsosFunzone }],
      hand: [discountedCharacter],
      inkwell: 3,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(discountedCharacter).playCost).toBe(
      discountedCharacter.cost,
    );
    expect(testEngine.asPlayerOne().quest(funzoneQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(discountedCharacter).playCost).toBe(3);
    expect(testEngine.asPlayerOne().playCard(discountedCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(discountedCharacter)).toBe("play");
  });
});
