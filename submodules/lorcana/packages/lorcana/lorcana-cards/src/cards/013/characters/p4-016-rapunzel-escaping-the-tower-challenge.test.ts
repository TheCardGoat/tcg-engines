import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rapunzelEscapingTheTowerP4Challenge as rapunzelEscapingTheTowerP4Challenge16 } from "./p4-016-rapunzel-escaping-the-tower-challenge";

const discardFodder = createMockCharacter({
  id: "rapunzel-p4-016-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

describe("Rapunzel - Escaping the Tower - Challenge 16", () => {
  it("discards a card to get +1 lore and Evasive until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelEscapingTheTowerP4Challenge16],
      hand: [discardFodder],
      deck: 3,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(rapunzelEscapingTheTowerP4Challenge16, {
        costs: { discardCards: [discardFodder] },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardLore(rapunzelEscapingTheTowerP4Challenge16)).toBe(2);
    expect(
      testEngine.asPlayerOne().hasKeyword(rapunzelEscapingTheTowerP4Challenge16, "Evasive"),
    ).toBe(true);
  });
});
