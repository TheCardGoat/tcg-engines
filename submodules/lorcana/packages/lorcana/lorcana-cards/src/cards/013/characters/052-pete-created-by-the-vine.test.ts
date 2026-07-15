import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { peteCreatedByTheVine } from "./052-pete-created-by-the-vine";

const floodbornAlly = createMockCharacter({
  id: "pete-created-by-the-vine-floodborn-ally",
  name: "Floodborn Ally",
  cost: 2,
  classifications: ["Floodborn", "Ally"],
});

describe("Pete - Created by the Vine", () => {
  it("gives your Floodborn characters Challenger +1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [peteCreatedByTheVine, floodbornAlly],
    });

    expect(testEngine.asPlayerOne().getKeywordValue(floodbornAlly, "Challenger")).toBe(1);
  });
});
