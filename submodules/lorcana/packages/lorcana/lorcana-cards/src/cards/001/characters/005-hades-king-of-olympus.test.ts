import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hadesKingOfOlympus } from "./005-hades-king-of-olympus";

const villainAlly = createMockCharacter({
  id: "hades-king-of-olympus-villain-ally",
  name: "Villain Ally",
  cost: 2,
  lore: 1,
  classifications: ["Storyborn", "Villain"],
});

const heroAlly = createMockCharacter({
  id: "hades-king-of-olympus-hero-ally",
  name: "Hero Ally",
  cost: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Hades - King of Olympus", () => {
  it("SINISTER PLOT - gets +1 lore for each other Villain character you have in play", () => {
    const soloEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hadesKingOfOlympus],
    });

    expect(soloEngine.getCard(hadesKingOfOlympus).lore).toBe(hadesKingOfOlympus.lore);

    const villainEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hadesKingOfOlympus, villainAlly],
    });

    expect(villainEngine.getCard(hadesKingOfOlympus).lore).toBe(hadesKingOfOlympus.lore + 1);

    const mixedEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hadesKingOfOlympus, villainAlly, heroAlly],
    });

    expect(mixedEngine.getCard(hadesKingOfOlympus).lore).toBe(hadesKingOfOlympus.lore + 1);
  });
});
