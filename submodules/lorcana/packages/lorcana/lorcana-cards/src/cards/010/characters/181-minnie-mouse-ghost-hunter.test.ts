import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { minnieMouseGhostHunter } from "./181-minnie-mouse-ghost-hunter";
import { donaldDuckGhostHunter } from "./172-donald-duck-ghost-hunter";

const nonDetectiveCharacter = createMockCharacter({
  id: "minnie-test-non-detective",
  name: "Non-Detective",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

describe("Minnie Mouse - Ghost Hunter", () => {
  describe("SEARCH THE SHADOWS - When you play this character, chosen Detective character gains Alert this turn.", () => {
    it("grants Alert to chosen Detective character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [minnieMouseGhostHunter],
        inkwell: minnieMouseGhostHunter.cost,
        play: [donaldDuckGhostHunter],
      });

      expect(testEngine.asPlayerOne().playCard(minnieMouseGhostHunter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(minnieMouseGhostHunter),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [donaldDuckGhostHunter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: donaldDuckGhostHunter,
        keyword: "Alert",
      });
    });

    it("allows Minnie to target herself since she is a Detective", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [minnieMouseGhostHunter],
        inkwell: minnieMouseGhostHunter.cost,
      });

      expect(testEngine.asPlayerOne().playCard(minnieMouseGhostHunter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(minnieMouseGhostHunter),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [minnieMouseGhostHunter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: minnieMouseGhostHunter,
        keyword: "Alert",
      });
    });

    it("Alert expires at the end of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [minnieMouseGhostHunter],
        inkwell: minnieMouseGhostHunter.cost,
        play: [donaldDuckGhostHunter],
      });

      expect(testEngine.asPlayerOne().playCard(minnieMouseGhostHunter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(minnieMouseGhostHunter),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [donaldDuckGhostHunter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: donaldDuckGhostHunter,
        keyword: "Alert",
      });

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(donaldDuckGhostHunter, "Alert")).toBe(false);
    });

    it("only targets Detective characters, not non-Detective characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [minnieMouseGhostHunter],
        inkwell: minnieMouseGhostHunter.cost,
        play: [nonDetectiveCharacter],
      });

      expect(testEngine.asPlayerOne().playCard(minnieMouseGhostHunter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(minnieMouseGhostHunter),
      ).toBeSuccessfulCommand();

      // The non-detective should not be a valid target, so targeting it should fail
      const result = testEngine
        .asPlayerOne()
        .resolveNextPending({ targets: [nonDetectiveCharacter] });
      expect(result).not.toBeSuccessfulCommand();
    });
  });

  describe("Card properties", () => {
    it("has correct base stats", () => {
      expect(minnieMouseGhostHunter.strength).toBe(2);
      expect(minnieMouseGhostHunter.willpower).toBe(3);
      expect(minnieMouseGhostHunter.lore).toBe(1);
      expect(minnieMouseGhostHunter.cost).toBe(2);
    });

    it("is a common Steel character and is inkable", () => {
      expect(minnieMouseGhostHunter.inkable).toBe(true);
      expect(minnieMouseGhostHunter.inkType).toEqual(["steel"]);
      expect(minnieMouseGhostHunter.rarity).toBe("common");
    });

    it("has Detective classification", () => {
      expect(minnieMouseGhostHunter.classifications).toContain("Detective");
    });
  });
});
