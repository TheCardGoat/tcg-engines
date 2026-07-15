import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { shenziHyenaPackLeader } from "./087-shenzi-hyena-pack-leader";

const mockLocation = createMockLocation({
  id: "shenzi-test-loc",
  name: "Test Location",
  cost: 2,
  moveCost: 1,
  willpower: 8,
  lore: 1,
});

const weakDefender = createMockCharacter({
  id: "shenzi-weak-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 2,
});

const toughDefender = createMockCharacter({
  id: "shenzi-tough-defender",
  name: "Tough Defender",
  cost: 3,
  strength: 2,
  willpower: 10,
});

describe("Shenzi - Hyena Pack Leader", () => {
  describe("I'LL HANDLE THIS - While this character is at a location, she gets +3 {S}.", () => {
    it("gets +3 strength while at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [shenziHyenaPackLeader, mockLocation],
        inkwell: mockLocation.moveCost,
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getCardStrength(shenziHyenaPackLeader)).toBe(
        shenziHyenaPackLeader.strength,
      );

      expect(
        testEngine.asPlayerOne().moveCharacterToLocation(shenziHyenaPackLeader, mockLocation),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(shenziHyenaPackLeader)).toBe(
        shenziHyenaPackLeader.strength + 3,
      );
    });

    it("does NOT get +3 strength when not at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [shenziHyenaPackLeader],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getCardStrength(shenziHyenaPackLeader)).toBe(
        shenziHyenaPackLeader.strength,
      );
    });
  });

  describe("WHAT'S THE HURRY? - While this character is at a location, whenever she challenges another character, you may draw a card.", () => {
    it("allows drawing a card when challenging while at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mockLocation, { card: shenziHyenaPackLeader, atLocation: mockLocation }],
          deck: 5,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

      expect(
        testEngine.asPlayerOne().challenge(shenziHyenaPackLeader, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore + 1);
    });

    it("can decline the optional draw", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mockLocation, { card: shenziHyenaPackLeader, atLocation: mockLocation }],
          deck: 5,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

      expect(
        testEngine.asPlayerOne().challenge(shenziHyenaPackLeader, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore);
    });

    it("does NOT trigger when challenging while NOT at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [shenziHyenaPackLeader],
          deck: 5,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(shenziHyenaPackLeader, weakDefender),
      ).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("triggers even when Shenzi does not banish the defender", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mockLocation, { card: shenziHyenaPackLeader, atLocation: mockLocation }],
          deck: 5,
        },
        {
          play: [{ card: toughDefender, exerted: true }],
          deck: 1,
        },
      );

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

      expect(
        testEngine.asPlayerOne().challenge(shenziHyenaPackLeader, toughDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(toughDefender)).toBe("play");

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore + 1);
    });

    it("does NOT trigger when being challenged (as defender)", () => {
      const strongOpp = createMockCharacter({
        id: "shenzi-strong-opp",
        name: "Strong Opponent",
        cost: 5,
        strength: 10,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            mockLocation,
            { card: shenziHyenaPackLeader, atLocation: mockLocation, exerted: true },
          ],
          deck: 3,
        },
        {
          play: [strongOpp],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(strongOpp, shenziHyenaPackLeader),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(shenziHyenaPackLeader)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });
  });
});
