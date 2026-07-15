import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { grandmotherWillowAncientAdvisorEpic } from "./206-grandmother-willow-ancient-advisor-epic";

const discountedCharacter = createMockCharacter({
  id: "grandmother-willow-epic-discounted-character",
  name: "Discounted Character",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Grandmother Willow - Ancient Advisor (Epic)", () => {
  it("reduces the cost of the next character you play after Grandmother Willow enters play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [grandmotherWillowAncientAdvisorEpic, discountedCharacter],
      inkwell: grandmotherWillowAncientAdvisorEpic.cost + discountedCharacter.cost - 1,
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(grandmotherWillowAncientAdvisorEpic),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().canPlayCard(discountedCharacter)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(discountedCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(discountedCharacter)).toBe("play");
  });
});
