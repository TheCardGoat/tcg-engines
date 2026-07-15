import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mrIncredibleTakingOutTheTrash } from "./185-mr-incredible-taking-out-the-trash";

const villainCharacter = createMockCharacter({
  id: "mr-incredible-villain",
  name: "Villain Target",
  cost: 3,
  strength: 2,
  willpower: 5,
  classifications: ["Storyborn", "Villain"],
});

describe("Mr. Incredible - Taking Out the Trash", () => {
  it("KA-POW! - deals 2 damage to chosen opposing Villain character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mrIncredibleTakingOutTheTrash],
        inkwell: mrIncredibleTakingOutTheTrash.cost,
      },
      {
        play: [villainCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(mrIncredibleTakingOutTheTrash),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mrIncredibleTakingOutTheTrash, {
        resolveOptional: true,
        targets: [villainCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(villainCharacter)).toBe(2);
  });
});
