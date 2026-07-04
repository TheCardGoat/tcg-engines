import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rapunzelsTowerTakenByTheVine } from "./037-rapunzels-tower-taken-by-the-vine";

const towerFloodborn = createMockCharacter({
  id: "rapunzels-tower-floodborn",
  name: "Tower Floodborn",
  cost: 3,
  willpower: 3,
  classifications: ["Floodborn", "Hero"],
});

const towerStoryborn = createMockCharacter({
  id: "rapunzels-tower-storyborn",
  name: "Tower Storyborn",
  cost: 3,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

describe("Rapunzel's Tower - Taken by the Vine", () => {
  it("gives your Floodborn characters +2 willpower", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelsTowerTakenByTheVine, towerFloodborn, towerStoryborn],
    });

    expect(testEngine.getCard(towerFloodborn).willpower).toBe(5);
    expect(testEngine.getCard(towerStoryborn).willpower).toBe(3);
  });
});
