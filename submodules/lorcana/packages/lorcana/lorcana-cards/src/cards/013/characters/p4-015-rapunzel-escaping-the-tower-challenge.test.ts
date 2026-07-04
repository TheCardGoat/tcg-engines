import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rapunzelEscapingTheTowerP4Challenge } from "./p4-015-rapunzel-escaping-the-tower-challenge";

const discardFodder = createMockCharacter({
  id: "rapunzel-p4-015-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

describe("Rapunzel - Escaping the Tower - Challenge 15", () => {
  it("discards a card to get +1 lore and Evasive until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelEscapingTheTowerP4Challenge],
      hand: [discardFodder],
      deck: 3,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(rapunzelEscapingTheTowerP4Challenge, {
        costs: { discardCards: [discardFodder] },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardLore(rapunzelEscapingTheTowerP4Challenge)).toBe(2);
    expect(
      testEngine.asPlayerOne().hasKeyword(rapunzelEscapingTheTowerP4Challenge, "Evasive"),
    ).toBe(true);
  });
});
