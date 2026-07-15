import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { donaldDuckGhostHunter } from "./172-donald-duck-ghost-hunter";
import { goofyGhostHunter } from "./021-goofy-ghost-hunter";
import { minnieMouseGhostHunter } from "./181-minnie-mouse-ghost-hunter";

describe("Donald Duck - Ghost Hunter", () => {
  describe("RAISE A RUCKUS - When you play this character, chosen Detective character gains Challenger +2 this turn.", () => {
    it("grants Challenger +2 to chosen Detective character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckGhostHunter],
        inkwell: donaldDuckGhostHunter.cost,
        play: [goofyGhostHunter],
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckGhostHunter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckGhostHunter),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [goofyGhostHunter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: goofyGhostHunter,
        keyword: "Challenger",
        value: 2,
      });
    });

    it("allows Donald to target himself since he is a Detective", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckGhostHunter],
        inkwell: donaldDuckGhostHunter.cost,
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckGhostHunter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckGhostHunter),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [donaldDuckGhostHunter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: donaldDuckGhostHunter,
        keyword: "Challenger",
        value: 2,
      });
    });

    it("Challenger +2 expires at the end of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckGhostHunter],
        inkwell: donaldDuckGhostHunter.cost,
        play: [goofyGhostHunter],
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckGhostHunter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckGhostHunter),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [goofyGhostHunter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: goofyGhostHunter,
        keyword: "Challenger",
        value: 2,
      });

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(goofyGhostHunter, "Challenger")).toBe(false);
    });
    it("can target multiple Detective characters - targets one chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckGhostHunter],
        inkwell: donaldDuckGhostHunter.cost,
        play: [goofyGhostHunter, minnieMouseGhostHunter],
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckGhostHunter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckGhostHunter),
      ).toBeSuccessfulCommand();

      // Target only one detective
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [goofyGhostHunter] }),
      ).toBeSuccessfulCommand();

      // The chosen detective has Challenger +2
      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: goofyGhostHunter,
        keyword: "Challenger",
        value: 2,
      });

      // The other detective does not
      expect(testEngine.asPlayerOne().hasKeyword(minnieMouseGhostHunter, "Challenger")).toBe(false);
    });
  });

  describe("Card properties", () => {
    it("has correct base stats", () => {
      expect(donaldDuckGhostHunter.strength).toBe(5);
      expect(donaldDuckGhostHunter.willpower).toBe(4);
      expect(donaldDuckGhostHunter.lore).toBe(1);
      expect(donaldDuckGhostHunter.cost).toBe(4);
    });

    it("is a common Steel character and is inkable", () => {
      expect(donaldDuckGhostHunter.inkable).toBe(true);
      expect(donaldDuckGhostHunter.inkType).toEqual(["steel"]);
      expect(donaldDuckGhostHunter.rarity).toBe("common");
    });

    it("has Detective classification", () => {
      expect(donaldDuckGhostHunter.classifications).toContain("Detective");
    });
  });
});
