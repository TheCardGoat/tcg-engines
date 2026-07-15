import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { shenziHyenaPackLeader } from "./085-shenzi-hyena-pack-leader";

const weakDefender = createMockCharacter({
  id: "shenzi-weak-defender",
  name: "Weak Defender",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const testLocation = createMockLocation({
  id: "shenzi-test-location",
  name: "Test Location",
  cost: 2,
  moveCost: 1,
  willpower: 5,
  lore: 1,
});

describe("Shenzi - Hyena Pack Leader", () => {
  describe("I'LL HANDLE THIS — While this character is at a location, she gets +3 strength.", () => {
    it("gets +3 strength while at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: shenziHyenaPackLeader, atLocation: testLocation }, testLocation],
      });

      const card = testEngine.asPlayerOne().getCard(shenziHyenaPackLeader);
      expect(card.strength).toBe(shenziHyenaPackLeader.strength + 3);
    });

    it("has base strength when not at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [shenziHyenaPackLeader, testLocation],
      });

      const card = testEngine.asPlayerOne().getCard(shenziHyenaPackLeader);
      expect(card.strength).toBe(shenziHyenaPackLeader.strength);
    });
  });

  describe("WHAT'S THE HURRY? — While at a location, whenever she challenges another character, you may draw a card.", () => {
    it("draws a card when Shenzi (at a location) challenges another character and ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: shenziHyenaPackLeader, atLocation: testLocation }, testLocation],
          deck: 5,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 2,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(shenziHyenaPackLeader, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(shenziHyenaPackLeader, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore + 1);
    });

    it("is optional — player can decline the draw", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: shenziHyenaPackLeader, atLocation: testLocation }, testLocation],
          deck: 5,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 2,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(shenziHyenaPackLeader, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(shenziHyenaPackLeader, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore);
    });

    it("does NOT draw a card when Shenzi challenges but is NOT at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [shenziHyenaPackLeader, testLocation],
          deck: 5,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 2,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(shenziHyenaPackLeader, weakDefender),
      ).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      // Shenzi is not at a location — no card drawn
      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore);
    });

    it("does NOT draw a card when Shenzi (at a location) challenges a location", () => {
      const opponentLocation = createMockLocation({
        id: "shenzi-opponent-location",
        name: "Opponent Location",
        cost: 2,
        moveCost: 1,
        willpower: 8,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: shenziHyenaPackLeader, atLocation: testLocation }, testLocation],
          deck: 5,
        },
        {
          play: [opponentLocation],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(shenziHyenaPackLeader, opponentLocation),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
