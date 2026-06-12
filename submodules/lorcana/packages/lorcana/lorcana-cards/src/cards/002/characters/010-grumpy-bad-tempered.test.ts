import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { grumpyBadtempered } from "./010-grumpy-bad-tempered";
import { bashfulHopelessRomantic } from "./001-bashful-hopeless-romantic";
import { aladdinStreetRat } from "../../001/characters/105-aladdin-street-rat";

describe("Grumpy - Bad-Tempered", () => {
  it("THERE'S TROUBLE A-BREWIN' - Your other Seven Dwarfs characters get +1 {S}", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: grumpyBadtempered },
        { card: bashfulHopelessRomantic },
        { card: aladdinStreetRat },
      ],
    });

    const grumpyId = testEngine.findCardInstanceId(grumpyBadtempered, "play");
    const bashfulId = testEngine.findCardInstanceId(bashfulHopelessRomantic, "play");
    const aladdinId = testEngine.findCardInstanceId(aladdinStreetRat, "play");

    // Bashful: 2 base + 1 = 3
    expect(testEngine.asServer().getCard(bashfulId).strength).toBe(
      bashfulHopelessRomantic.strength + 1,
    );

    // Grumpy: Should not buff himself (it says "other")
    expect(testEngine.asServer().getCard(grumpyId).strength).toBe(grumpyBadtempered.strength);

    // Aladdin: Not Seven Dwarfs, should not change
    expect(testEngine.asServer().getCard(aladdinId).strength).toBe(aladdinStreetRat.strength);
  });
});
