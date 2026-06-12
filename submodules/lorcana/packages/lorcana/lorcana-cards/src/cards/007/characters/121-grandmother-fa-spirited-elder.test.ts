import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { grandmotherFaSpiritedElder } from "./121-grandmother-fa-spirited-elder";

const friendlyTarget = createMockCharacter({
  id: "grandmother-fa-friendly-target",
  name: "Friendly Target",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Grandmother Fa - Spirited Elder", () => {
  describe("I'VE GOT ALL THE LUCK WE'LL NEED - Whenever this character quests, you may give chosen character of yours +2 {S} this turn.", () => {
    it("may give one of your characters +2 strength when Grandmother Fa quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: grandmotherFaSpiritedElder, isDrying: false },
          { card: friendlyTarget, isDrying: false },
        ],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(grandmotherFaSpiritedElder)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(grandmotherFaSpiritedElder, {
          resolveOptional: true,
          targets: [friendlyTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(friendlyTarget)?.strength).toBe(
        friendlyTarget.strength + 2,
      );
    });

    it("+2 strength expires at the end of the turn it was granted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: grandmotherFaSpiritedElder, isDrying: false },
            { card: friendlyTarget, isDrying: false },
          ],
          deck: 5,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().quest(grandmotherFaSpiritedElder)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(grandmotherFaSpiritedElder, {
          resolveOptional: true,
          targets: [friendlyTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(friendlyTarget)?.strength).toBe(
        friendlyTarget.strength + 2,
      );

      // Pass to opponent's turn, then back — the +2S is "this turn" only.
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(friendlyTarget)?.strength).toBe(
        friendlyTarget.strength,
      );
    });

    it("does not change strength if you decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: grandmotherFaSpiritedElder, isDrying: false },
          { card: friendlyTarget, isDrying: false },
        ],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(grandmotherFaSpiritedElder)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(grandmotherFaSpiritedElder, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(friendlyTarget)?.strength).toBe(
        friendlyTarget.strength,
      );
    });
  });
});
