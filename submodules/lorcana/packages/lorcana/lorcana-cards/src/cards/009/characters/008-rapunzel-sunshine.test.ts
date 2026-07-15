import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { rapunzelSunshine } from "./008-rapunzel-sunshine";

const damagedAlly = createMockCharacter({
  id: "rapunzel-009-sunshine-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  willpower: 5,
});

describe("Rapunzel - Sunshine [Set 009]", () => {
  describe("MAGIC HAIR - {E} Remove up to 2 damage from chosen character.", () => {
    it("removes up to 2 damage from chosen character and exerts Rapunzel", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: rapunzelSunshine, isDrying: false },
          { card: damagedAlly, damage: 3 },
        ],
      });

      const rapunzelId = testEngine.findCardInstanceId(rapunzelSunshine, "play", PLAYER_ONE);
      const allyId = testEngine.findCardInstanceId(damagedAlly, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().activateAbility(rapunzelId, {
          abilityIndex: 0,
          targets: [allyId],
        }),
      ).toBeSuccessfulCommand();

      // Should have removed 2 damage (from 3 to 1)
      expect(testEngine.asServer().getCard(allyId)?.damage).toBe(1);

      // Rapunzel should be exerted
      expect(testEngine.asPlayerOne().isExerted(rapunzelId)).toBe(true);
    });

    it("removes all damage when character has less than 2 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: rapunzelSunshine, isDrying: false },
          { card: damagedAlly, damage: 1 },
        ],
      });

      const rapunzelId = testEngine.findCardInstanceId(rapunzelSunshine, "play", PLAYER_ONE);
      const allyId = testEngine.findCardInstanceId(damagedAlly, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().activateAbility(rapunzelId, {
          abilityIndex: 0,
          targets: [allyId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asServer().getCard(allyId)?.damage).toBe(0);
    });

    it("cannot be activated when Rapunzel is already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: rapunzelSunshine, exerted: true },
          { card: damagedAlly, damage: 2 },
        ],
      });

      const rapunzelId = testEngine.findCardInstanceId(rapunzelSunshine, "play", PLAYER_ONE);
      const allyId = testEngine.findCardInstanceId(damagedAlly, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().activateAbility(rapunzelId, {
          abilityIndex: 0,
          targets: [allyId],
        }),
      ).not.toBeSuccessfulCommand();
    });

    it("can target an opponent's character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rapunzelSunshine, isDrying: false }],
        },
        {
          play: [{ card: damagedAlly, damage: 2 }],
        },
      );

      const rapunzelId = testEngine.findCardInstanceId(rapunzelSunshine, "play", PLAYER_ONE);
      const opponentAllyId = testEngine.findCardInstanceId(damagedAlly, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().activateAbility(rapunzelId, {
          abilityIndex: 0,
          targets: [opponentAllyId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asServer().getCard(opponentAllyId)?.damage).toBe(0);
    });
  });
});
