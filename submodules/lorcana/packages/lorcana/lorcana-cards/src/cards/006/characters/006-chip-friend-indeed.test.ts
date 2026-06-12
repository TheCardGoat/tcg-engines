import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { chipFriendIndeed } from "./006-chip-friend-indeed";

const targetCharacter = createMockCharacter({
  id: "target-character",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Chip - Friend Indeed", () => {
  it("DALE'S PARTNER - When you play this character, chosen character gets +1 lore this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [chipFriendIndeed],
      inkwell: chipFriendIndeed.cost,
      play: [targetCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(chipFriendIndeed)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(chipFriendIndeed, { targets: [targetCharacter] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(targetCharacter)).toBe(targetCharacter.lore + 1);
  });

  it("DALE'S PARTNER - lore bonus expires at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [chipFriendIndeed],
        inkwell: chipFriendIndeed.cost,
        play: [targetCharacter],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(chipFriendIndeed)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(chipFriendIndeed, { targets: [targetCharacter] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(targetCharacter)).toBe(targetCharacter.lore + 1);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(targetCharacter)).toBe(targetCharacter.lore);
  });
});
