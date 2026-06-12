import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { anitaRadcliffeDogLover } from "./155-anita-radcliffe-dog-lover";
import { patchPlayfulPup } from "./025-patch-playful-pup";

const nonPuppyCharacter = createMockCharacter({
  id: "non-puppy",
  name: "Non Puppy",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

describe("Anita Radcliffe - Dog Lover", () => {
  it("I'LL TAKE CARE OF YOU - grants Resist +1 to chosen Puppy character until start of next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [anitaRadcliffeDogLover],
        inkwell: anitaRadcliffeDogLover.cost,
        play: [patchPlayfulPup],
      },
      {
        play: [nonPuppyCharacter],
      },
    );

    expect(testEngine.asPlayerOne().hasKeyword(patchPlayfulPup, "Resist")).toBe(false);

    expect(testEngine.asPlayerOne().playCard(anitaRadcliffeDogLover)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const targetId = testEngine.findCardInstanceId(patchPlayfulPup, "play");
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetId] }),
    ).toBeSuccessfulCommand();

    // Patch should now have Resist +1
    expect(testEngine.asPlayerOne().hasKeyword(patchPlayfulPup, "Resist")).toBe(true);
    expect(testEngine.asPlayerOne().getKeywordValue(patchPlayfulPup, "Resist")).toBe(1);

    // Pass player one's turn - resist should still be active
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(patchPlayfulPup, "Resist")).toBe(true);

    // Pass player two's turn (start of player one's next turn) - resist should expire
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(patchPlayfulPup, "Resist")).toBe(false);
  });
});
