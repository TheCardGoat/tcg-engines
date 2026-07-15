import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { happyGoodnatured } from "./011-happy-good-natured";
import { bashfulHopelessRomantic } from "./001-bashful-hopeless-romantic";
import { aladdinStreetRat } from "../../001/characters/105-aladdin-street-rat";

describe("Happy - Good-Natured", () => {
  it("DIG, DIG, DIG - Gets +1 Lore if another Seven Dwarfs is in play", () => {
    // Scenario 1: Happy alone (or with non-Dwarf)
    const engine1 = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: happyGoodnatured },
        { card: aladdinStreetRat }, // Not Seven Dwarfs
      ],
    });

    const happyId1 = engine1.findCardInstanceId(happyGoodnatured, "play");
    // Only Happy: 2 Lore (base)
    expect(engine1.asServer().getCard(happyId1).lore).toBe(2);

    // Scenario 2: Happy + Bashful
    const engine2 = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: happyGoodnatured },
        { card: bashfulHopelessRomantic }, // Seven Dwarfs
      ],
    });

    const happyId2 = engine2.findCardInstanceId(happyGoodnatured, "play");
    // Happy + Bashful: 2 base + 1 = 3
    expect(engine2.asServer().getCard(happyId2).lore).toBe(3);
  });
});
