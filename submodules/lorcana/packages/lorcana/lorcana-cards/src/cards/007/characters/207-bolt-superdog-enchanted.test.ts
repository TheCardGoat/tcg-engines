import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { boltSuperdogEnchanted } from "./207-bolt-superdog-enchanted";

const healthyAlly = createMockCharacter({
  id: "bolt-superdog-enchanted-healthy-ally",
  name: "Healthy Ally",
  cost: 2,
});

const damagedAlly = createMockCharacter({
  id: "bolt-superdog-enchanted-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
});

const illusionTarget = createMockCharacter({
  id: "bolt-superdog-enchanted-illusion-target",
  name: "Illusion Target",
  cost: 3,
  classifications: ["Dreamborn", "Ally", "Illusion"],
});

const ordinaryTarget = createMockCharacter({
  id: "bolt-superdog-enchanted-ordinary-target",
  name: "Ordinary Target",
  cost: 3,
});

describe("Bolt - Superdog (Enchanted)", () => {
  describe("MARK OF POWER - Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.", () => {
    it("gains lore for each other undamaged character when it readies", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: boltSuperdogEnchanted, isDrying: false },
          healthyAlly,
          { card: damagedAlly, damage: 1 },
        ],
        deck: 2,
      });

      const initialLore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
      const boltId = testEngine.findCardInstanceId(boltSuperdogEnchanted, "play");

      testEngine.asServer().manualExertCard(boltId);
      testEngine.asServer().manualReadyCard(boltId);

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(initialLore + 1);
    });
  });

  describe("BOLT STARE - {E} — Banish chosen Illusion character.", () => {
    it("banishes a chosen Illusion character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: boltSuperdogEnchanted, isDrying: false }],
          deck: 2,
        },
        {
          play: [illusionTarget],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(boltSuperdogEnchanted, {
          ability: "BOLT STARE",
          targets: [illusionTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(illusionTarget)).toBe("discard");
      expect(testEngine.asPlayerOne().getCard(boltSuperdogEnchanted).exerted).toBe(true);
    });

    it("does not let you target a non-Illusion character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: boltSuperdogEnchanted, isDrying: false }],
          deck: 2,
        },
        {
          play: [ordinaryTarget],
          deck: 2,
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(boltSuperdogEnchanted, {
        ability: "BOLT STARE",
        targets: [ordinaryTarget],
      });

      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(ordinaryTarget)).toBe("play");
      expect(testEngine.asPlayerOne().getCard(boltSuperdogEnchanted).exerted).toBe(false);
    });
  });
});
