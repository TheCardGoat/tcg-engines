import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { stitchTeamUnderdog } from "./171-stitch-team-underdog";

const targetCharacter = createMockCharacter({
  id: "stitch-test-target",
  name: "Target Character",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Stitch - Team Underdog", () => {
  describe("HEAVE HO! - When you play this character, you may deal 2 damage to chosen character.", () => {
    it("deals 2 damage to a chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [stitchTeamUnderdog],
          inkwell: stitchTeamUnderdog.cost,
          play: [targetCharacter],
          deck: 5,
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(stitchTeamUnderdog)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(stitchTeamUnderdog),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(targetCharacter)).toBe(2);
    });

    it("can target an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [stitchTeamUnderdog],
          inkwell: stitchTeamUnderdog.cost,
          deck: 5,
        },
        {
          play: [targetCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(stitchTeamUnderdog)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(stitchTeamUnderdog),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(2);
    });
  });
});
