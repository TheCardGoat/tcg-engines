import { describe, expect, it } from "bun:test";
import { GundamTestEngine } from "../../src/testing/gundam-test-engine";
import {
  assertCardInZone,
  assertGamePhase,
  assertGameSegment,
  assertPriorityPlayer,
  assertTurnPlayer,
  assertUnitHasStats,
  assertZoneCount,
} from "./assertion-helpers";

describe("Assertion Helpers", () => {
  describe("assertZoneCount", () => {
    it("should pass when zone has expected count", () => {
      const engine = new GundamTestEngine({ deck: 5, hand: 3 }, { deck: 10 });

      expect(() =>
        assertZoneCount(engine, "deck", 5, "player_one"),
      ).not.toThrow();
      expect(() =>
        assertZoneCount(engine, "hand", 3, "player_one"),
      ).not.toThrow();
      expect(() =>
        assertZoneCount(engine, "deck", 10, "player_two"),
      ).not.toThrow();
    });

    it("should throw when zone count does not match", () => {
      const engine = new GundamTestEngine({ deck: 5 });

      expect(() => assertZoneCount(engine, "deck", 10, "player_one")).toThrow(
        "Expected deck to have 10 cards, but found 5",
      );
    });
  });

  describe("assertGamePhase", () => {
    it("should pass when game is in expected phase", () => {
      const engine = new GundamTestEngine();

      expect(() => assertGamePhase(engine, "mainPhase")).not.toThrow();
    });

    it("should throw when game is not in expected phase", () => {
      const engine = new GundamTestEngine();

      expect(() => assertGamePhase(engine, "drawPhase")).toThrow(
        'Expected game phase to be "drawPhase", but found "mainPhase"',
      );
    });
  });

  describe("assertGameSegment", () => {
    it("should pass when game is in expected segment", () => {
      const engine = new GundamTestEngine();

      expect(() => assertGameSegment(engine, "duringGame")).not.toThrow();
    });

    it("should throw when game is not in expected segment", () => {
      const engine = new GundamTestEngine();

      expect(() => assertGameSegment(engine, "startingAGame")).toThrow(
        'Expected game segment to be "startingAGame", but found "duringGame"',
      );
    });
  });

  describe("assertTurnPlayer", () => {
    it("should pass when expected player has turn", () => {
      const engine = new GundamTestEngine();

      expect(() => assertTurnPlayer(engine, "player_one")).not.toThrow();
    });

    it("should throw when different player has turn", () => {
      const engine = new GundamTestEngine();

      expect(() => assertTurnPlayer(engine, "player_two")).toThrow(
        'Expected turn player to be "player_two", but found "player_one"',
      );
    });
  });

  describe("assertPriorityPlayer", () => {
    it("should pass when expected player has priority", () => {
      const engine = new GundamTestEngine();

      expect(() => assertPriorityPlayer(engine, "player_one")).not.toThrow();
    });

    it("should throw when different player has priority", () => {
      const engine = new GundamTestEngine();

      expect(() => assertPriorityPlayer(engine, "player_two")).toThrow(
        'Expected priority player to be "player_two", but found "player_one"',
      );
    });
  });

  describe("assertCardInZone", () => {
    it("should pass when card is in expected zone", () => {
      const engine = new GundamTestEngine({ hand: 3 });
      const handCards = engine.getZone("hand", "player_one");

      expect(() =>
        assertCardInZone(engine, handCards[0], "hand", "player_one"),
      ).not.toThrow();
    });

    it("should throw when card is not in expected zone", () => {
      const engine = new GundamTestEngine({ hand: 3, deck: 5 });
      const handCards = engine.getZone("hand", "player_one");

      expect(() =>
        assertCardInZone(engine, handCards[0], "deck", "player_one"),
      ).toThrow("Expected card");
    });
  });

  describe("assertUnitHasStats", () => {
    it("should pass when unit has expected stats", () => {
      const engine = new GundamTestEngine({ battleArea: 1 });
      const battleCards = engine.getCardsByZone("battleArea", "player_one");
      const unitInstanceId = battleCards[0].instanceId;

      // Mock unit (Strike Gundam GD01-077) has AP 3, HP 4
      expect(() =>
        assertUnitHasStats(engine, unitInstanceId, {
          ap: 3,
          hp: 4,
        }),
      ).not.toThrow();
    });

    it("should throw when unit stats do not match", () => {
      const engine = new GundamTestEngine({ battleArea: 1 });
      const battleCards = engine.getCardsByZone("battleArea", "player_one");
      const unitInstanceId = battleCards[0].instanceId;

      expect(() =>
        assertUnitHasStats(engine, unitInstanceId, {
          ap: 5,
          hp: 5,
        }),
      ).toThrow("Expected unit");
    });
  });
});
