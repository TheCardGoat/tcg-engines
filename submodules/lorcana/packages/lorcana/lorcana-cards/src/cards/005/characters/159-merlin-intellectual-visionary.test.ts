import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { merlinIntellectualVisionary } from "./159-merlin-intellectual-visionary";
import { merlinSelfappointedMentor } from "../../001/characters/153-merlin-self-appointed-mentor";
import { simbaProtectiveCub } from "../../001/characters/020-simba-protective-cub";
import { arielOnHumanLegs } from "../../001/characters/001-ariel-on-human-legs";

describe("Merlin - Intellectual Visionary", () => {
  describe("Card properties", () => {
    it("should have correct stats", () => {
      expect(merlinIntellectualVisionary.cost).toBe(6);
      expect(merlinIntellectualVisionary.strength).toBe(3);
      expect(merlinIntellectualVisionary.willpower).toBe(7);
      expect(merlinIntellectualVisionary.lore).toBe(2);
    });

    it("should be a non-inkable sapphire card", () => {
      expect(merlinIntellectualVisionary.inkable).toBe(false);
      expect(merlinIntellectualVisionary.inkType).toEqual(["sapphire"]);
    });

    it("should have Floodborn Mentor Sorcerer classifications", () => {
      expect(merlinIntellectualVisionary.classifications).toEqual([
        "Floodborn",
        "Mentor",
        "Sorcerer",
      ]);
    });

    it("should have Shift 5 keyword ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [merlinIntellectualVisionary],
      });

      expect(testEngine.hasKeyword(merlinIntellectualVisionary, "Shift")).toBe(true);
    });
  });

  describe("Shift 5", () => {
    it("should be able to shift onto another Merlin character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [merlinIntellectualVisionary],
        play: [merlinSelfappointedMentor],
        inkwell: 5,
      });

      const shiftTarget = testEngine.findCardInstanceId(
        merlinSelfappointedMentor,
        "play",
        "player_one",
      );

      expect(
        testEngine.asPlayerOne().playCard(merlinIntellectualVisionary, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(merlinIntellectualVisionary)).toBe("play");
    });
  });

  describe("OVERDEVELOPED BRAIN - When you play this character, if you used Shift to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.", () => {
    it("triggers when played via Shift and moves a card from deck to hand when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 5,
        hand: [merlinIntellectualVisionary],
        play: [merlinSelfappointedMentor],
        deck: [simbaProtectiveCub, arielOnHumanLegs],
      });

      const shiftTarget = testEngine.findCardInstanceId(
        merlinSelfappointedMentor,
        "play",
        "player_one",
      );

      expect(
        testEngine.asPlayerOne().playCard(merlinIntellectualVisionary, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      // Accept the optional search
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(merlinIntellectualVisionary, {
          resolveOptional: true,
          targets: [arielOnHumanLegs],
        }),
      ).toBeSuccessfulCommand();

      // The selected card should move from deck to hand
      expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("hand");
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(1);
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).deck).toBe(1);
    });

    it("can be declined when played via Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 5,
        hand: [merlinIntellectualVisionary],
        play: [merlinSelfappointedMentor],
        deck: [simbaProtectiveCub],
      });

      const shiftTarget = testEngine.findCardInstanceId(
        merlinSelfappointedMentor,
        "play",
        "player_one",
      );

      expect(
        testEngine.asPlayerOne().playCard(merlinIntellectualVisionary, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      // Decline the optional search
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(merlinIntellectualVisionary, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Card should still be in deck
      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("deck");
    });

    it("does NOT trigger when played normally without Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: merlinIntellectualVisionary.cost,
        hand: [merlinIntellectualVisionary],
        deck: [simbaProtectiveCub],
      });

      expect(
        testEngine.asPlayerOne().playCard(merlinIntellectualVisionary),
      ).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
