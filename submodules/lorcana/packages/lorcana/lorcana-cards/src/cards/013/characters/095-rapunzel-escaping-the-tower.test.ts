import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rapunzelEscapingTheTower } from "./095-rapunzel-escaping-the-tower";

const discardFodder = createMockCharacter({
  id: "rapunzel-escaping-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

describe("Rapunzel - Escaping the Tower", () => {
  it("discards a card to get +1 lore and Evasive until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelEscapingTheTower],
      hand: [discardFodder],
      deck: 3,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(rapunzelEscapingTheTower, {
        costs: { discardCards: [discardFodder] },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardLore(rapunzelEscapingTheTower)).toBe(2);
    expect(testEngine.asPlayerOne().hasKeyword(rapunzelEscapingTheTower, "Evasive")).toBe(true);
  });
});
