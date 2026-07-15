import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { littleJohnResourcefulOutlaw } from "./178-little-john-resourceful-outlaw";
import { simbaProtectiveCub } from "../../001/characters/020-simba-protective-cub";
import { montereyJackDefiantProtector } from "../../008/characters/188-monterey-jack-defiant-protector";

const nonBodyguardCharacter = createMockCharacter({
  id: "little-john-non-bodyguard-char",
  name: "Non Bodyguard",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Little John - Resourceful Outlaw", () => {
  describe("Shift 4", () => {
    it("has Shift keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [littleJohnResourcefulOutlaw],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(littleJohnResourcefulOutlaw, "Shift")).toBe(true);
    });
  });

  describe("OKAY, BIG SHOT - While this character is exerted, your characters with Bodyguard gain Resist +1 and get +1 {L}.", () => {
    it("gives Resist +1 to Bodyguard characters while Little John is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: littleJohnResourcefulOutlaw, exerted: true }, simbaProtectiveCub],
        deck: 1,
      });

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: simbaProtectiveCub,
        keyword: "Resist",
      });
      expect(testEngine.asPlayerOne().getKeywordValue(simbaProtectiveCub, "Resist")).toBe(1);
    });

    it("gives +1 lore to Bodyguard characters while Little John is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: littleJohnResourcefulOutlaw, exerted: true }, simbaProtectiveCub],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCardLore(simbaProtectiveCub)).toBe(
        simbaProtectiveCub.lore + 1,
      );
    });

    it("affects multiple Bodyguard characters while Little John is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: littleJohnResourcefulOutlaw, exerted: true },
          simbaProtectiveCub,
          montereyJackDefiantProtector,
        ],
        deck: 1,
      });

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: simbaProtectiveCub,
        keyword: "Resist",
      });
      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: montereyJackDefiantProtector,
        keyword: "Resist",
      });
      expect(testEngine.asPlayerOne().getCardLore(simbaProtectiveCub)).toBe(
        simbaProtectiveCub.lore + 1,
      );
      expect(testEngine.asPlayerOne().getCardLore(montereyJackDefiantProtector)).toBe(
        montereyJackDefiantProtector.lore + 1,
      );
    });

    it("does not affect non-Bodyguard characters while Little John is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: littleJohnResourcefulOutlaw, exerted: true }, nonBodyguardCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: nonBodyguardCharacter,
        keyword: "Resist",
      });
      expect(testEngine.asPlayerOne().getCardLore(nonBodyguardCharacter)).toBe(
        nonBodyguardCharacter.lore,
      );
    });

    it("does not affect Bodyguard characters while Little John is ready", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [littleJohnResourcefulOutlaw, simbaProtectiveCub],
        deck: 1,
      });

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: simbaProtectiveCub,
        keyword: "Resist",
      });
      expect(testEngine.asPlayerOne().getCardLore(simbaProtectiveCub)).toBe(
        simbaProtectiveCub.lore,
      );
    });

    it("does not affect Little John itself (no Bodyguard)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: littleJohnResourcefulOutlaw, exerted: true }],
        deck: 1,
      });

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: littleJohnResourcefulOutlaw,
        keyword: "Resist",
      });
      expect(testEngine.asPlayerOne().getCardLore(littleJohnResourcefulOutlaw)).toBe(
        littleJohnResourcefulOutlaw.lore,
      );
    });
  });
});
