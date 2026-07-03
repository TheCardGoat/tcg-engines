import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { translationCollar } from "./173-translation-collar";

const translatedFriend = createMockCharacter({
  id: "translation-collar-friend",
  name: "Translated Friend",
  cost: 2,
  lore: 1,
});

describe("Translation Collar", () => {
  it("gives the chosen character +1 lore and Support this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [translationCollar, translatedFriend],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(translationCollar, {
        targets: [translatedFriend],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCard(translatedFriend).lore).toBe(2);
    expect(testEngine.asPlayerOne().hasKeyword(translatedFriend, "Support")).toBe(true);
  });
});
