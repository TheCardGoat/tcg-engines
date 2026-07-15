import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { baymaxArmoredCompanion } from "./157-baymax-armored-companion";

const allyCharacter = createMockCharacter({
  id: "baymax-test-ally",
  name: "Test Ally",
  cost: 2,
  strength: 2,
  willpower: 6,
  lore: 1,
});

describe("Baymax - Armored Companion", () => {
  describe("THE TREATMENT IS WORKING - When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.", () => {
    it("removes up to 2 damage and gains lore on quest", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [baymaxArmoredCompanion, allyCharacter],
        deck: 5,
      });

      // Put 4 damage on ally
      expect(testEngine.asServer().manualSetDamage(allyCharacter, 4)).toBeSuccessfulCommand();

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      // Quest with Baymax
      expect(testEngine.asPlayerOne().quest(baymaxArmoredCompanion)).toBeSuccessfulCommand();

      // Baymax has lore 2, so questing gains 2 lore
      const loreAfterQuest = testEngine.asPlayerOne().getLore(PLAYER_ONE);
      expect(loreAfterQuest).toBe(loreBefore + 2);

      // Resolve the triggered optional ability
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(baymaxArmoredCompanion),
      ).toBeSuccessfulCommand();

      // Resolve optional + target selection + amount
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Resolve amount if prompted (upTo: true)
      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        testEngine.asPlayerOne().resolveNextPending({ amount: 2 });
      }

      // Ally should have 2 damage remaining (4 - 2 = 2)
      const allyId = testEngine.findCardInstanceId(allyCharacter, "play", PLAYER_ONE);
      const ally = testEngine.asServer().getCard(allyId);
      expect(ally.damage).toBe(2);

      // Should have gained 2 additional lore (1 per damage removed)
      const loreAfterAbility = testEngine.asPlayerOne().getLore(PLAYER_ONE);
      expect(loreAfterAbility).toBe(loreBefore + 2 + 2); // quest lore + heal lore
    });

    it("removes damage and gains lore on play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [baymaxArmoredCompanion],
        inkwell: baymaxArmoredCompanion.cost,
        play: [allyCharacter],
        deck: 5,
      });

      // Put 4 damage on ally
      expect(testEngine.asServer().manualSetDamage(allyCharacter, 4)).toBeSuccessfulCommand();

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      // Play Baymax
      expect(testEngine.asPlayerOne().playCard(baymaxArmoredCompanion)).toBeSuccessfulCommand();

      // Resolve the triggered optional ability
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(baymaxArmoredCompanion),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        testEngine.asPlayerOne().resolveNextPending({ amount: 2 });
      }

      const allyId = testEngine.findCardInstanceId(allyCharacter, "play", PLAYER_ONE);
      const ally = testEngine.asServer().getCard(allyId);
      expect(ally.damage).toBe(2);

      // Should have gained 2 lore (1 per damage removed)
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + 2);
    });

    it("gains lore proportional to actual damage removed (less damage than max)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [baymaxArmoredCompanion, allyCharacter],
        deck: 5,
      });

      // Only 1 damage on ally (less than the max of 2)
      expect(testEngine.asServer().manualSetDamage(allyCharacter, 1)).toBeSuccessfulCommand();

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(baymaxArmoredCompanion)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(baymaxArmoredCompanion),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        testEngine.asPlayerOne().resolveNextPending({ amount: 2 });
      }

      // Only 1 damage was removed (only 1 was present)
      const allyId = testEngine.findCardInstanceId(allyCharacter, "play", PLAYER_ONE);
      const ally = testEngine.asServer().getCard(allyId);
      expect(ally.damage).toBe(0);

      // Should gain only 1 lore (1 damage actually removed) + 2 quest lore
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + 2 + 1);
    });

    it("does not gain lore if the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [baymaxArmoredCompanion, allyCharacter],
        deck: 5,
      });

      expect(testEngine.asServer().manualSetDamage(allyCharacter, 4)).toBeSuccessfulCommand();

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(baymaxArmoredCompanion)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(baymaxArmoredCompanion, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Only quest lore, no heal lore
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + 2);
    });

    it("opponent does not gain lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [baymaxArmoredCompanion, allyCharacter],
        deck: 5,
      });

      expect(testEngine.asServer().manualSetDamage(allyCharacter, 4)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().quest(baymaxArmoredCompanion)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(baymaxArmoredCompanion),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        testEngine.asPlayerOne().resolveNextPending({ amount: 2 });
      }

      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(0);
    });
  });
});
