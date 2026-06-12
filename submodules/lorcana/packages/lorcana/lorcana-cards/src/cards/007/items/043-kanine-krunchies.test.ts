import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kanineKrunchies } from "./043-kanine-krunchies";

const puppyAlly = createMockCharacter({
  id: "kanine-krunchies-puppy-ally",
  name: "Puppy Ally",
  cost: 1,
  willpower: 2,
  classifications: ["Storyborn", "Puppy"],
});

const nonPuppyAlly = createMockCharacter({
  id: "kanine-krunchies-non-puppy-ally",
  name: "Non Puppy Ally",
  cost: 1,
  willpower: 2,
  classifications: ["Storyborn", "Hero"],
});

const opposingPuppy = createMockCharacter({
  id: "kanine-krunchies-opposing-puppy",
  name: "Opposing Puppy",
  cost: 1,
  willpower: 2,
  classifications: ["Storyborn", "Puppy"],
});

describe("Kanine Krunchies", () => {
  it("only gives your Puppy characters +1 willpower", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [kanineKrunchies, puppyAlly, nonPuppyAlly],
      },
      {
        play: [opposingPuppy],
      },
    );

    expect(testEngine.asPlayerOne().getCard(puppyAlly)?.willpower).toBe(3);
    expect(testEngine.asPlayerOne().getCard(nonPuppyAlly)?.willpower).toBe(2);
    expect(testEngine.asPlayerTwo().getCard(opposingPuppy)?.willpower).toBe(2);
  });
});
