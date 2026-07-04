import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { willieTheGiantCreatedByTheVine } from "./178-willie-the-giant-created-by-the-vine";

const floodbornAlly = createMockCharacter({
  id: "willie-vine-floodborn-ally",
  name: "Floodborn Ally",
  cost: 3,
  classifications: ["Floodborn", "Hero"],
});

describe("Willie the Giant - Created by the Vine", () => {
  it("gives your Floodborn characters Resist +1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [willieTheGiantCreatedByTheVine, floodbornAlly],
    });

    expect(testEngine.asPlayerOne().getKeywordValue(floodbornAlly, "Resist")).toBe(1);
  });
});
