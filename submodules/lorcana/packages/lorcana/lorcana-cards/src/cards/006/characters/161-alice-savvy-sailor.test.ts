import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { aliceSavvySailor } from "./161-alice-savvy-sailor";

const allyA = createMockCharacter({
  id: "alice-savvy-sailor-ally-a",
  name: "Alice Ally A",
  cost: 2,
  lore: 1,
});

const allyB = createMockCharacter({
  id: "alice-savvy-sailor-ally-b",
  name: "Alice Ally B",
  cost: 2,
  lore: 2,
});

describe("Alice - Savvy Sailor", () => {
  describe("AHOY! - Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.", () => {
    it("regression THE-956: applies to the chosen ally when multiple legal targets exist", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: aliceSavvySailor, isDrying: false },
          { card: allyA, isDrying: false },
          { card: allyB, isDrying: false },
        ],
        deck: 2,
      });

      const allyBId = testEngine.findCardInstanceId(allyB, "play", "p1");

      expect(testEngine.asPlayerOne().quest(aliceSavvySailor)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(aliceSavvySailor, {
          targets: [allyBId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(allyA)).toBe(allyA.lore);
      expect(testEngine.asPlayerOne().getCardLore(allyB)).toBe(allyB.lore + 1);
      expect(testEngine.asPlayerOne().getCardLore(aliceSavvySailor)).toBe(aliceSavvySailor.lore);

      expect(testEngine.asPlayerOne()).toHaveKeyword({ card: allyB, keyword: "Ward" });
      expect(testEngine.asPlayerOne()).not.toHaveKeyword({ card: allyA, keyword: "Ward" });
      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: aliceSavvySailor,
        keyword: "Ward",
      });
    });
  });
});
