import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { darkwingDuckDarkwolfDog } from "./043-darkwing-duck-darkwolf-dog";

const exertedDefender = createMockCharacter({
  id: "darkwing-darkwolf-defender",
  name: "Exerted Defender",
  strength: 2,
  willpower: 3,
  cost: 2,
});

describe("Darkwing Duck - Darkwolf Dog", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [darkwingDuckDarkwolfDog],
    });

    const cardUnderTest = testEngine.getCardModel(darkwingDuckDarkwolfDog);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("can challenge the turn it is played because of Rush", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [darkwingDuckDarkwolfDog],
        inkwell: darkwingDuckDarkwolfDog.cost,
        deck: 5,
      },
      {
        play: [{ card: exertedDefender, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(darkwingDuckDarkwolfDog)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(darkwingDuckDarkwolfDog, exertedDefender),
    ).toBeSuccessfulCommand();
  });
});
