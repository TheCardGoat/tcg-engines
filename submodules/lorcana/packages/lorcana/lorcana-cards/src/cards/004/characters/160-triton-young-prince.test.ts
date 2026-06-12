import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { tritonYoungPrince } from "./160-triton-young-prince";

const playerOneLocation = createMockLocation({
  id: "triton-test-p1-location",
  name: "Player One Location",
  cost: 3,
  moveCost: 1,
  willpower: 4,
  lore: 1,
});

const anotherLocation = createMockLocation({
  id: "triton-test-another-location",
  name: "Another Location",
  cost: 2,
  moveCost: 1,
  willpower: 5,
  lore: 1,
});

describe("Triton - Young Prince", () => {
  describe("SUPERIOR SWIMMER - During your turn, this character gains Evasive.", () => {
    it("has Evasive during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tritonYoungPrince],
      });

      // Player one's turn by default
      expect(testEngine.asPlayerOne().hasKeyword(tritonYoungPrince, "Evasive")).toBe(true);
    });

    it("does NOT have Evasive during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tritonYoungPrince],
      });

      testEngine.asPlayerOne().passTurn();

      // Now it's player two's turn, Triton should not have Evasive
      expect(testEngine.asPlayerOne().hasKeyword(tritonYoungPrince, "Evasive")).toBe(false);
    });
  });

  describe("KEEPER OF ATLANTICA - Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.", () => {
    it("triggers when one of your locations is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tritonYoungPrince, playerOneLocation],
      });

      // Banish the location by setting fatal damage
      expect(
        testEngine.asServer().manualSetDamage(playerOneLocation, playerOneLocation.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(playerOneLocation)).toBe("discard");

      // KEEPER OF ATLANTICA should trigger
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("puts the banished location into the inkwell facedown and exerted when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tritonYoungPrince, playerOneLocation],
      });

      expect(
        testEngine.asServer().manualSetDamage(playerOneLocation, playerOneLocation.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(playerOneLocation)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional ability
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tritonYoungPrince, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // The location should now be in the inkwell
      expect(testEngine.asPlayerOne().getCardZone(playerOneLocation)).toBe("inkwell");

      // The location should be facedown in the inkwell
      const locationInInkwell = testEngine.asPlayerOne().getCard(playerOneLocation);
      expect(locationInInkwell.exerted).toBe(true);
    });

    it("can be declined (optional)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tritonYoungPrince, playerOneLocation],
      });

      expect(
        testEngine.asServer().manualSetDamage(playerOneLocation, playerOneLocation.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(playerOneLocation)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tritonYoungPrince, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // The location should remain in the discard
      expect(testEngine.asPlayerOne().getCardZone(playerOneLocation)).toBe("discard");
    });

    it("triggers only for the location that was banished from play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tritonYoungPrince, anotherLocation],
        discard: [playerOneLocation],
      });

      // Banish the location in play
      expect(
        testEngine.asServer().manualSetDamage(anotherLocation, anotherLocation.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(anotherLocation)).toBe("discard");

      // Should trigger for the banished location, not the already-discarded one
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("does NOT trigger when opponent's location is banished", () => {
      const opponentLocation = createMockLocation({
        id: "triton-test-opponent-location",
        name: "Opponent Location",
        cost: 2,
        moveCost: 1,
        willpower: 4,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tritonYoungPrince],
        },
        {
          play: [opponentLocation],
        },
      );

      // Banish opponent's location
      expect(
        testEngine.asServer().manualSetDamage(opponentLocation, opponentLocation.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentLocation)).toBe("discard");

      // KEEPER OF ATLANTICA should NOT trigger - it's not your location
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
