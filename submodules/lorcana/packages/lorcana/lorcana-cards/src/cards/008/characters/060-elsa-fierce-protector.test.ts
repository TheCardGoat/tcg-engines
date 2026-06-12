import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { elsaFierceProtector } from "./060-elsa-fierce-protector";
import { bambiPrinceOfTheForest } from "./057-bambi-prince-of-the-forest";

const opposingCharacter = createMockCharacter({
  id: "elsa-fp-opposing-char",
  name: "Opposing Character",
  cost: 2,
});

describe("Elsa - Fierce Protector", () => {
  it("ICE OVER: {E}, 1 {I}, Choose and discard a card — Exert chosen opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        hand: [bambiPrinceOfTheForest],
        play: [{ card: elsaFierceProtector, isDrying: false }],
      },
      {
        play: [opposingCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(elsaFierceProtector, {
        ability: "ICE OVER",
        targets: [opposingCharacter],
        costs: {
          discardCards: [bambiPrinceOfTheForest],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(bambiPrinceOfTheForest)).toBe("discard");
    expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
  });
});
