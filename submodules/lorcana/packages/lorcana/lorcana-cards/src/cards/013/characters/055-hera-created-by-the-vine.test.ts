import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { heraCreatedByTheVine } from "./055-hera-created-by-the-vine";

const floodbornAlly = createMockCharacter({
  id: "hera-created-by-the-vine-floodborn-ally",
  name: "Floodborn Ally",
  cost: 2,
  classifications: ["Floodborn", "Ally"],
});

describe("Hera - Created by the Vine", () => {
  it("gains 1 lore when you play Hera herself", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [heraCreatedByTheVine],
      inkwell: heraCreatedByTheVine.cost,
    });

    expect(testEngine.asPlayerOne().playCard(heraCreatedByTheVine)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });

  it("gains 1 lore when you play another Floodborn character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [heraCreatedByTheVine],
      hand: [floodbornAlly],
      inkwell: floodbornAlly.cost,
    });

    expect(testEngine.asPlayerOne().playCard(floodbornAlly)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
