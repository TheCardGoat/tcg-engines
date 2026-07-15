import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { chipRangerLeader } from "./012-chip-ranger-leader";

const dale = createMockCharacter({
  id: "chip-ranger-leader-dale",
  name: "Dale",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const supportTarget = createMockCharacter({
  id: "chip-ranger-leader-support-target",
  name: "Support Target",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Chip - Ranger Leader", () => {
  describe("THE VALUE OF FRIENDSHIP - While you have a character named Dale in play, this character gains Support.", () => {
    it("does not grant Support when Dale is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [chipRangerLeader, supportTarget],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(chipRangerLeader)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("grants Support while Dale is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [chipRangerLeader, dale, supportTarget],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(chipRangerLeader)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(chipRangerLeader, {
          resolveOptional: true,
          targets: [supportTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
        supportTarget.strength + chipRangerLeader.strength,
      );
    });
  });
});
