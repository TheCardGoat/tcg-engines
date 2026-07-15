import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { helpingHand } from "../../006/actions/164-helping-hand";
import { clarabelleNewsReporter } from "./153-clarabelle-news-reporter";
const quester = createMockCharacter({
  id: "clarabelle-quester",
  name: "Quester",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Clarabelle - News Reporter", () => {
  it("regression: BREAKING STORY grants +1 strength to characters that gain Support from other sources", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: clarabelleNewsReporter, isDrying: false },
        { card: quester, isDrying: false },
      ],
      hand: [helpingHand],
      inkwell: helpingHand.cost,
      deck: 5,
    });

    expect(
      testEngine.asPlayerOne().playCard(helpingHand, { targets: [quester] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(quester, "Support")).toBe(true);
    expect(testEngine.asPlayerOne().getCardStrength(quester)).toBe(2);
  });
});
