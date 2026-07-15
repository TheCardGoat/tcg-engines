import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { baymaxPersonalHealthcareCompanion } from "./156-baymax-personal-healthcare-companion";

const inventorCharacter = createMockCharacter({
  id: "baymax-test-inventor",
  name: "Test Inventor",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Inventor"],
});

const nonInventorCharacter = createMockCharacter({
  id: "baymax-test-non-inventor",
  name: "Test Non-Inventor",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const damagedAlly = createMockCharacter({
  id: "baymax-test-damaged-ally",
  name: "Damaged Ally",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Baymax - Personal Healthcare Companion", () => {
  describe("FULLY CHARGED - If you have an Inventor character in play, you pay 1 {I} less to play this character.", () => {
    it("costs 1 less when an Inventor character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [baymaxPersonalHealthcareCompanion],
        play: [inventorCharacter],
        // Baymax costs 3, with discount should cost 2
        inkwell: baymaxPersonalHealthcareCompanion.cost - 1,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(baymaxPersonalHealthcareCompanion),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(baymaxPersonalHealthcareCompanion)).toBe("play");
    });

    it("costs full price when no Inventor character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [baymaxPersonalHealthcareCompanion],
        play: [nonInventorCharacter],
        // Only enough ink for discounted cost, not full cost
        inkwell: baymaxPersonalHealthcareCompanion.cost - 1,
        deck: 5,
      });

      const result = testEngine.asPlayerOne().playCard(baymaxPersonalHealthcareCompanion);
      expect(result.success).toBe(false);
    });

    it("can be played at full cost without Inventor", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [baymaxPersonalHealthcareCompanion],
        play: [nonInventorCharacter],
        inkwell: baymaxPersonalHealthcareCompanion.cost,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(baymaxPersonalHealthcareCompanion),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(baymaxPersonalHealthcareCompanion)).toBe("play");
    });
  });

  describe("YOU SAID 'OW' - 2 {I} — Remove up to 1 damage from another chosen character.", () => {
    it("removes 1 damage from a damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [baymaxPersonalHealthcareCompanion, damagedAlly],
        inkwell: 2,
        deck: 5,
      });

      expect(testEngine.asServer().manualSetDamage(damagedAlly, 3)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().activateAbility(baymaxPersonalHealthcareCompanion, {
          targets: [damagedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(damagedAlly).damage).toBe(2);
    });

    it("requires 2 ink to activate", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [baymaxPersonalHealthcareCompanion, damagedAlly],
        inkwell: 1, // Not enough ink
        deck: 5,
      });

      expect(testEngine.asServer().manualSetDamage(damagedAlly, 2)).toBeSuccessfulCommand();

      const result = testEngine.asPlayerOne().activateAbility(baymaxPersonalHealthcareCompanion, {
        targets: [damagedAlly],
      });
      expect(result.success).toBe(false);
    });

    it("does not exert Baymax (ink cost only, no exert)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [baymaxPersonalHealthcareCompanion, damagedAlly],
        inkwell: 2,
        deck: 5,
      });

      expect(testEngine.asServer().manualSetDamage(damagedAlly, 1)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().activateAbility(baymaxPersonalHealthcareCompanion, {
          targets: [damagedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(baymaxPersonalHealthcareCompanion)).toBe(false);
    });
  });
});
