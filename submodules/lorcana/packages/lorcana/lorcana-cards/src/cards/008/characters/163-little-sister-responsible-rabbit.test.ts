import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { littleSisterResponsibleRabbit } from "./163-little-sister-responsible-rabbit";

const damagedCharacter = createMockCharacter({
  id: "test-damaged-char",
  name: "Damaged Character",
  cost: 2,
  strength: 2,
  willpower: 6,
  lore: 1,
});

describe("Little Sister - Responsible Rabbit", () => {
  describe("LET ME HELP - When you play this character, you may remove up to 1 damage from chosen character.", () => {
    it("removes 1 damage from chosen character on play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [littleSisterResponsibleRabbit],
        inkwell: littleSisterResponsibleRabbit.cost,
        play: [damagedCharacter],
        deck: 5,
      });

      expect(testEngine.asServer().manualSetDamage(damagedCharacter, 3)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().playCard(littleSisterResponsibleRabbit),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(littleSisterResponsibleRabbit),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        testEngine.asPlayerOne().resolveNextPending({ amount: 1 });
      }

      const charId = testEngine.findCardInstanceId(damagedCharacter, "play", PLAYER_ONE);
      const char = testEngine.asServer().getCard(charId);
      expect(char.damage).toBe(2);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [littleSisterResponsibleRabbit],
        inkwell: littleSisterResponsibleRabbit.cost,
        play: [damagedCharacter],
        deck: 5,
      });

      expect(testEngine.asServer().manualSetDamage(damagedCharacter, 3)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().playCard(littleSisterResponsibleRabbit),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(littleSisterResponsibleRabbit, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      const charId = testEngine.findCardInstanceId(damagedCharacter, "play", PLAYER_ONE);
      const char = testEngine.asServer().getCard(charId);
      expect(char.damage).toBe(3);
    });

    it("removes only available damage when character has less than max", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [littleSisterResponsibleRabbit],
        inkwell: littleSisterResponsibleRabbit.cost,
        play: [damagedCharacter],
        deck: 5,
      });

      expect(testEngine.asServer().manualSetDamage(damagedCharacter, 1)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().playCard(littleSisterResponsibleRabbit),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(littleSisterResponsibleRabbit),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        testEngine.asPlayerOne().resolveNextPending({ amount: 1 });
      }

      const charId = testEngine.findCardInstanceId(damagedCharacter, "play", PLAYER_ONE);
      const char = testEngine.asServer().getCard(charId);
      expect(char.damage).toBe(0);
    });
  });
});
