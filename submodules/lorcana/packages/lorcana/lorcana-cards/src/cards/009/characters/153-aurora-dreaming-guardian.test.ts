import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { auroraDreamingGuardian } from "./153-aurora-dreaming-guardian";

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

describe("Aurora - Dreaming Guardian", () => {
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
  });
});
