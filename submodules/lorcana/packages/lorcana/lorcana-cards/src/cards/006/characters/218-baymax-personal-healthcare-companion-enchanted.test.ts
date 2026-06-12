import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { baymaxPersonalHealthcareCompanionEnchanted } from "./218-baymax-personal-healthcare-companion-enchanted";
import { hiroHamadaRoboticsProdigy } from "./145-hiro-hamada-robotics-prodigy";

const nonInventorAlly = createMockCharacter({
  id: "non-inventor-ally",
  name: "Non-Inventor Ally",
  cost: 2,
  willpower: 5,
});

describe("Baymax - Personal Healthcare Companion (Enchanted)", () => {
  describe("FULLY CHARGED - If you have an Inventor character in play, you pay 1 {I} less to play this character.", () => {
    it("should reduce cost by 1 when you have an Inventor in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [baymaxPersonalHealthcareCompanionEnchanted],
        play: [hiroHamadaRoboticsProdigy],
        inkwell: baymaxPersonalHealthcareCompanionEnchanted.cost - 1, // 2 ink, enough with discount
        deck: 5,
      });

      const result = testEngine.asPlayerOne().playCard(baymaxPersonalHealthcareCompanionEnchanted);
      expect(result.success).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(baymaxPersonalHealthcareCompanionEnchanted)).toBe(
        "play",
      );
    });

    it("should NOT reduce cost when no Inventor is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [baymaxPersonalHealthcareCompanionEnchanted],
        play: [nonInventorAlly],
        inkwell: baymaxPersonalHealthcareCompanionEnchanted.cost - 1, // 2 ink, not enough without discount
        deck: 5,
      });

      const result = testEngine.asPlayerOne().playCard(baymaxPersonalHealthcareCompanionEnchanted);
      expect(result.success).toBe(false);
    });

    it("should play at full cost when no Inventor is in play and enough ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [baymaxPersonalHealthcareCompanionEnchanted],
        play: [nonInventorAlly],
        inkwell: baymaxPersonalHealthcareCompanionEnchanted.cost, // 3 ink, full cost
        deck: 5,
      });

      const result = testEngine.asPlayerOne().playCard(baymaxPersonalHealthcareCompanionEnchanted);
      expect(result.success).toBe(true);
    });
  });

  describe("YOU SAID 'OW' 2 {I} - Remove up to 1 damage from another chosen character.", () => {
    it("should remove 1 damage from a damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [baymaxPersonalHealthcareCompanionEnchanted, { card: nonInventorAlly, damage: 2 }],
        inkwell: 2,
        deck: 5,
      });

      const baymaxId = testEngine.findCardInstanceId(
        baymaxPersonalHealthcareCompanionEnchanted,
        "play",
      );
      const allyId = testEngine.findCardInstanceId(nonInventorAlly, "play");

      testEngine.asPlayerOne().activateAbility(baymaxId, { abilityIndex: 0, targets: [allyId] });

      expect(testEngine.asPlayerOne().getDamage(allyId)).toBe(1);
    });

    it("should not be usable without enough ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [baymaxPersonalHealthcareCompanionEnchanted, { card: nonInventorAlly, damage: 2 }],
        inkwell: 1, // Not enough ink (needs 2)
        deck: 5,
      });

      const baymaxId = testEngine.findCardInstanceId(
        baymaxPersonalHealthcareCompanionEnchanted,
        "play",
      );
      const allyId = testEngine.findCardInstanceId(nonInventorAlly, "play");

      const result = testEngine
        .asPlayerOne()
        .activateAbility(baymaxId, { abilityIndex: 0, targets: [allyId] });

      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getDamage(allyId)).toBe(2);
    });
  });
});
