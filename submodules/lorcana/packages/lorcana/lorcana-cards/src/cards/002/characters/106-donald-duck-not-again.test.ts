import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { donaldDuckNotAgain } from "./106-donald-duck-not-again";

describe("Donald Duck - Not Again!", () => {
  it("PHOOEY! This character gets +1 {L} for each 1 damage on him.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: donaldDuckNotAgain }],
    });

    const donaldId = testEngine.findCardInstanceId(donaldDuckNotAgain, "play");

    // Initial Lore should be 1
    let donaldCard = testEngine.asServer().getCard(donaldId);
    expect(donaldCard.lore).toBe(1);

    // Deal 1 damage
    testEngine.asServer().manualSetDamage(donaldId, 1);
    donaldCard = testEngine.asServer().getCard(donaldId);
    expect(donaldCard.lore).toBe(2);

    // Deal 3 damage (Total 3)
    testEngine.asServer().manualSetDamage(donaldId, 3);
    donaldCard = testEngine.asServer().getCard(donaldId);
    expect(donaldCard.lore).toBe(4); // 1 base + 3 damage
  });

  it("Has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: donaldDuckNotAgain }],
    });
    const donaldId = testEngine.findCardInstanceId(donaldDuckNotAgain, "play");
    const donaldCard = testEngine.asServer().getCard(donaldId);

    expect(donaldCard.keywords).toContain("Evasive");
  });
});
