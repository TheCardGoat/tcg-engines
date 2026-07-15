import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { auroraWakingBeauty } from "./014-aurora-waking-beauty";
import { magicGoldenFlower } from "../../001/items/169-magic-golden-flower";

const damagedAlly = createMockCharacter({
  id: "aurora-test-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  willpower: 5,
});

describe("Aurora - Waking Beauty", () => {
  it("has Singer 5 keyword", () => {
    const keyword = auroraWakingBeauty.abilities?.find(
      (a) => a.type === "keyword" && a.keyword === "Singer",
    );
    expect(keyword).toBeDefined();
    expect((keyword as { value?: number }).value).toBe(5);
  });

  describe("SWEET DREAMS - Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.", () => {
    it("should ready Aurora when you heal a character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [auroraWakingBeauty, { card: damagedAlly, damage: 3 }, magicGoldenFlower],
        deck: 2,
      });

      const auroraId = testEngine.findCardInstanceId(auroraWakingBeauty, "play");
      const allyId = testEngine.findCardInstanceId(damagedAlly, "play");
      const flowerId = testEngine.findCardInstanceId(magicGoldenFlower, "play");

      // Exert Aurora (e.g., via quest) so we can verify she gets readied
      expect(testEngine.asPlayerOne().quest(auroraId)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(auroraId)).toBe(true);

      // Use Magic Golden Flower to heal the damaged ally
      testEngine.asPlayerOne().activateAbility(flowerId, { abilityIndex: 0, targets: [allyId] });

      // Resolve the SWEET DREAMS triggered ability
      testEngine.asPlayerOne().resolvePendingByCard(auroraWakingBeauty);

      // Aurora should be readied
      expect(testEngine.asPlayerOne().isExerted(auroraId)).toBe(false);

      // Aurora should have quest and challenge restrictions for this turn
      expect(testEngine.hasRestriction(auroraWakingBeauty, "cant-quest-or-challenge")).toBe(true);
    });

    it("should not ready Aurora when no damage is actually removed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          auroraWakingBeauty,
          damagedAlly, // no damage on this ally
          magicGoldenFlower,
        ],
        deck: 2,
      });

      const auroraId = testEngine.findCardInstanceId(auroraWakingBeauty, "play");
      const allyId = testEngine.findCardInstanceId(damagedAlly, "play");
      const flowerId = testEngine.findCardInstanceId(magicGoldenFlower, "play");

      // Exert Aurora
      expect(testEngine.asPlayerOne().quest(auroraId)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(auroraId)).toBe(true);

      // Use Magic Golden Flower on a character with no damage
      testEngine.asPlayerOne().activateAbility(flowerId, { abilityIndex: 0, targets: [allyId] });

      // Aurora should still be exerted since no damage was actually removed
      expect(testEngine.asPlayerOne().isExerted(auroraId)).toBe(true);

      // No restrictions should be applied
      expect(testEngine.hasRestriction(auroraWakingBeauty, "cant-quest-or-challenge")).toBe(false);
    });

    it("restrictions should expire after the turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [auroraWakingBeauty, { card: damagedAlly, damage: 3 }, magicGoldenFlower],
        deck: 2,
      });

      const auroraId = testEngine.findCardInstanceId(auroraWakingBeauty, "play");
      const allyId = testEngine.findCardInstanceId(damagedAlly, "play");
      const flowerId = testEngine.findCardInstanceId(magicGoldenFlower, "play");

      // Exert Aurora
      expect(testEngine.asPlayerOne().quest(auroraId)).toBeSuccessfulCommand();

      // Heal the ally to trigger SWEET DREAMS
      testEngine.asPlayerOne().activateAbility(flowerId, { abilityIndex: 0, targets: [allyId] });
      testEngine.asPlayerOne().resolvePendingByCard(auroraWakingBeauty);

      // Verify restrictions exist
      expect(testEngine.hasRestriction(auroraWakingBeauty, "cant-quest-or-challenge")).toBe(true);

      // Pass turn and opponent passes turn back
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Restrictions should have expired
      expect(testEngine.hasRestriction(auroraWakingBeauty, "cant-quest-or-challenge")).toBe(false);
    });
  });
});
