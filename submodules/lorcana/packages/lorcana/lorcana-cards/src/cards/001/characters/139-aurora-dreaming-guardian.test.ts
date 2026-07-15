import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { auroraDreamingGuardian } from "./139-aurora-dreaming-guardian";

const ally = createMockCharacter({
  id: "aurora-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const anotherAlly = createMockCharacter({
  id: "aurora-another-ally",
  name: "Another Ally",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Aurora - Dreaming Guardian (Set 1)", () => {
  it("has Shift keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [auroraDreamingGuardian],
    });
    expect(testEngine.hasKeyword(auroraDreamingGuardian, "Shift")).toBe(true);
  });

  describe("PROTECTIVE EMBRACE - Your other characters gain Ward", () => {
    it("grants Ward to other characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [auroraDreamingGuardian, ally, anotherAlly],
      });
      expect(testEngine.hasKeyword(ally, "Ward")).toBe(true);
      expect(testEngine.hasKeyword(anotherAlly, "Ward")).toBe(true);
    });

    it("does not grant Ward to Aurora herself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [auroraDreamingGuardian],
      });
      expect(testEngine.hasKeyword(auroraDreamingGuardian, "Ward")).toBe(false);
    });

    it("two Auroras give Ward to each other", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [auroraDreamingGuardian, auroraDreamingGuardian],
      });
      expect(testEngine.hasKeyword(auroraDreamingGuardian, "Ward")).toBe(true);
    });

    // Player bug report: after playing Aurora, allied characters did not gain
    // Ward. PROTECTIVE EMBRACE is a continuous static ability so it must apply
    // immediately when Aurora enters play, even on the same turn while drying.
    it("grants Ward to other characters immediately when played from hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: auroraDreamingGuardian.cost,
        hand: [auroraDreamingGuardian],
        play: [{ card: ally, isDrying: false }],
        deck: 3,
      });

      expect(testEngine.hasKeyword(ally, "Ward")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(auroraDreamingGuardian)).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(ally, "Ward")).toBe(true);
    });

    it("does not grant Ward to opponent's characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [auroraDreamingGuardian],
          deck: 1,
        },
        {
          play: [ally],
          deck: 1,
        },
      );
      expect(testEngine.asPlayerTwo().hasKeyword(ally, "Ward")).toBe(false);
    });
  });
});
