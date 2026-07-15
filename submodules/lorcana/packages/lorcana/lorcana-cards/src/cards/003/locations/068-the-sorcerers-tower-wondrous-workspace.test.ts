import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theSorcerersTowerWondrousWorkspace } from "./068-the-sorcerers-tower-wondrous-workspace";

const magicBroom = createMockCharacter({
  id: "workspace-magic-broom",
  name: "Magic Broom",
  cost: 1,
  lore: 1,
});

describe("The Sorcerer's Tower - Wondrous Workspace", () => {
  it("lets Magic Broom move here for free and gives characters here +1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [theSorcerersTowerWondrousWorkspace, magicBroom],
    });

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(magicBroom, theSorcerersTowerWondrousWorkspace).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCard(magicBroom)?.lore).toBe(magicBroom.lore + 1);
  });
});
