import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { likeABirdInTheSky } from "./131-like-a-bird-in-the-sky";

const target = createMockCharacter({
  id: "like-a-bird-target",
  name: "Soaring Hero",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Like A Bird In the Sky", () => {
  it("gives chosen character +1 {L} and Evasive until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [likeABirdInTheSky],
      inkwell: likeABirdInTheSky.cost,
      play: [target],
    });

    expect(
      testEngine.asPlayerOne().playCard(likeABirdInTheSky, { targets: [target] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(target)).toBe(target.lore + 1);
    expect(testEngine.asPlayerOne().getCard(target)?.hasEvasive).toBe(true);
  });
});
