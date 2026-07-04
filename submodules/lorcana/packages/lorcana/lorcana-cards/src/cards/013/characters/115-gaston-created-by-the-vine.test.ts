import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gastonCreatedByTheVine } from "./115-gaston-created-by-the-vine";

const floodbornAlly = createMockCharacter({
  id: "gaston-vine-floodborn-ally",
  name: "Floodborn Ally",
  cost: 3,
  strength: 2,
  classifications: ["Floodborn", "Hero"],
});

describe("Gaston - Created by the Vine", () => {
  it("gives your Floodborn characters +1 strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gastonCreatedByTheVine, floodbornAlly],
    });

    expect(testEngine.asPlayerOne().getCardStrength(floodbornAlly)).toBe(3);
  });
});
