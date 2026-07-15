import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { pinocchioOnTheRun } from "./057-pinocchio-on-the-run";
import { yzmaWithoutBeautySleep } from "./061-yzma-without-beauty-sleep";
import { arthurTrainedSwordsman } from "./069-arthur-trained-swordsman";
import { theSorcerersSpellbook } from "../items/068-the-sorcerers-spellbook";

describe("Pinocchio - On the Run", () => {
  describe("Shift 3", () => {
    it("has Shift keyword with cost 3", () => {
      const testEngine = new LorcanaTestEngine({
        play: [pinocchioOnTheRun],
      });
      const cardModel = testEngine.getCardModel(pinocchioOnTheRun);
      expect(cardModel.hasShift()).toBe(true);
      expect(cardModel.shiftInkCost).toBe(3);
    });
  });

  describe("LISTEN TO YOUR CONSCIENCE — When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.", () => {
    it("returns a character with cost 3 or less to their player's hand", () => {
      // yzmaWithoutBeautySleep has cost 3 — valid target
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pinocchioOnTheRun],
          inkwell: pinocchioOnTheRun.cost,
          play: [yzmaWithoutBeautySleep],
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().playCard(pinocchioOnTheRun)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(pinocchioOnTheRun, { targets: [yzmaWithoutBeautySleep] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(yzmaWithoutBeautySleep)).toBe("hand");
    });

    it("returns an item with cost 3 or less to their player's hand", () => {
      // theSorcerersSpellbook has cost 3 and is an item — valid target
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pinocchioOnTheRun],
          inkwell: pinocchioOnTheRun.cost,
          play: [theSorcerersSpellbook],
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().playCard(pinocchioOnTheRun)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(pinocchioOnTheRun, { targets: [theSorcerersSpellbook] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(theSorcerersSpellbook)).toBe("hand");
    });

    it("auto-drains the trigger when no valid target exists", () => {
      // arthurTrainedSwordsman has cost 4 — NOT a valid target
      // When no valid targets exist, the optional effect produces no bag and arthur stays in play
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pinocchioOnTheRun],
          inkwell: pinocchioOnTheRun.cost,
          play: [arthurTrainedSwordsman],
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().playCard(pinocchioOnTheRun)).toBeSuccessfulCommand();

      // With no legal choices, the optional bag entry resolves as a no-op without prompting.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // arthur remains in play untouched
      expect(testEngine.asPlayerOne().getCardZone(arthurTrainedSwordsman)).toBe("play");
    });

    it("allows skipping the optional effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pinocchioOnTheRun],
          inkwell: pinocchioOnTheRun.cost,
          play: [yzmaWithoutBeautySleep],
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().playCard(pinocchioOnTheRun)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(pinocchioOnTheRun, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // yzma should still be in play since we declined
      expect(testEngine.asPlayerOne().getCardZone(yzmaWithoutBeautySleep)).toBe("play");
    });

    it("can target an opponent's character with cost 3 or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pinocchioOnTheRun],
          inkwell: pinocchioOnTheRun.cost,
          deck: 2,
        },
        {
          play: [yzmaWithoutBeautySleep],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(pinocchioOnTheRun)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(pinocchioOnTheRun, { targets: [yzmaWithoutBeautySleep] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(yzmaWithoutBeautySleep)).toBe("hand");
    });
  });
});
