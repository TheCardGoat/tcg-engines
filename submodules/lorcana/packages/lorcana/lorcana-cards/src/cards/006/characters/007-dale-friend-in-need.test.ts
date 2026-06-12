import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { daleFriendInNeed } from "./007-dale-friend-in-need";

const chipInPlay = createMockCharacter({
  id: "dale-friend-in-need-chip",
  name: "Chip",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Dale - Friend in Need", () => {
  it("CHIP'S PARTNER - enters play exerted unless you have Chip in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [daleFriendInNeed],
      inkwell: daleFriendInNeed.cost,
    });

    expect(testEngine.asPlayerOne().playCard(daleFriendInNeed)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(daleFriendInNeed)).toBe(true);
  });

  it("CHIP'S PARTNER - stays ready if Chip is already in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [daleFriendInNeed],
      inkwell: daleFriendInNeed.cost,
      play: [chipInPlay],
    });

    expect(testEngine.asPlayerOne().playCard(daleFriendInNeed)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(daleFriendInNeed)).toBe(false);
  });
});
