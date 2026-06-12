import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { minnieMouseDrumMajor } from "./015-minnie-mouse-drum-major";
import { minnieMouseCompassionateFriend } from "./024-minnie-mouse-compassionate-friend";
import { simbaProtectiveCub } from "../../001/characters/020-simba-protective-cub";
import { arielOnHumanLegs } from "../../001/characters/001-ariel-on-human-legs";

describe("Minnie Mouse - Drum Major", () => {
  describe("Card properties", () => {
    it("should have correct stats", () => {
      expect(minnieMouseDrumMajor.cost).toBe(5);
      expect(minnieMouseDrumMajor.strength).toBe(4);
      expect(minnieMouseDrumMajor.willpower).toBe(4);
      expect(minnieMouseDrumMajor.lore).toBe(2);
    });

    it("should be an inkable amber card", () => {
      expect(minnieMouseDrumMajor.inkable).toBe(true);
      expect(minnieMouseDrumMajor.inkType).toEqual(["amber"]);
    });

    it("should have Floodborn Hero classifications", () => {
      expect(minnieMouseDrumMajor.classifications).toEqual(["Floodborn", "Hero"]);
    });

    it("should have Shift 4 keyword ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [minnieMouseDrumMajor],
      });

      expect(testEngine.hasKeyword(minnieMouseDrumMajor, "Shift")).toBe(true);
    });
  });

  describe("Shift 4", () => {
    it("should be able to shift onto another Minnie Mouse character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [minnieMouseDrumMajor],
        play: [minnieMouseCompassionateFriend],
        inkwell: 4,
      });

      const shiftTarget = testEngine.findCardInstanceId(
        minnieMouseCompassionateFriend,
        "play",
        "player_one",
      );

      expect(
        testEngine.asPlayerOne().playCard(minnieMouseDrumMajor, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(minnieMouseDrumMajor)).toBe("play");
    });
  });

  describe("PARADE ORDER - When you play this character, if you used Shift to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.", () => {
    it("triggers when played via Shift and puts chosen character card on top of deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 4,
        hand: [minnieMouseDrumMajor],
        play: [minnieMouseCompassionateFriend],
        deck: [simbaProtectiveCub, arielOnHumanLegs],
      });

      const shiftTarget = testEngine.findCardInstanceId(
        minnieMouseCompassionateFriend,
        "play",
        "player_one",
      );

      expect(
        testEngine.asPlayerOne().playCard(minnieMouseDrumMajor, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      // Accept the optional search
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(minnieMouseDrumMajor, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // The chosen card should remain in the deck (on top), not moved to hand
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).deck).toBe(2);
    });

    it("can be declined when played via Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 4,
        hand: [minnieMouseDrumMajor],
        play: [minnieMouseCompassionateFriend],
        deck: [simbaProtectiveCub],
      });

      const shiftTarget = testEngine.findCardInstanceId(
        minnieMouseCompassionateFriend,
        "play",
        "player_one",
      );

      expect(
        testEngine.asPlayerOne().playCard(minnieMouseDrumMajor, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      // Decline the optional search
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(minnieMouseDrumMajor, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Card should still be in deck
      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("deck");
    });

    it("does NOT trigger when played normally without Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: minnieMouseDrumMajor.cost,
        hand: [minnieMouseDrumMajor],
        deck: [simbaProtectiveCub],
      });

      expect(testEngine.asPlayerOne().playCard(minnieMouseDrumMajor)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
