import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mrsIncredibleSuperStretchy } from "./049-mrs-incredible-super-stretchy";

describe("Mrs. Incredible - Super Stretchy", () => {
  describe("FLEXIBLE THINKING - At the start of your turn, you may choose one:", () => {
    it("option 0: this character gains Evasive until the start of your next turn", () => {
      // Put Mrs. Incredible in P2's play; P1 passes so P2's turn starts
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 3 },
        { deck: 3, play: [mrsIncredibleSuperStretchy] },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(mrsIncredibleSuperStretchy, {
          resolveOptional: true,
          choiceIndex: 0,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCard(mrsIncredibleSuperStretchy)?.hasEvasive).toBe(true);
    });

    it("option 1: this character gets +1 lore this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 3 },
        { deck: 3, play: [mrsIncredibleSuperStretchy] },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(mrsIncredibleSuperStretchy, {
          resolveOptional: true,
          choiceIndex: 1,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardLore(mrsIncredibleSuperStretchy)).toBe(
        mrsIncredibleSuperStretchy.lore + 1,
      );
    });

    it("may decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 3 },
        { deck: 3, play: [mrsIncredibleSuperStretchy] },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(mrsIncredibleSuperStretchy, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // No Evasive gained — remains at base
      expect(testEngine.asPlayerTwo().getCard(mrsIncredibleSuperStretchy)?.hasEvasive).toBeFalsy();
      expect(testEngine.asPlayerTwo().getCardLore(mrsIncredibleSuperStretchy)).toBe(
        mrsIncredibleSuperStretchy.lore,
      );
    });
  });
});
