import { describe, expect, it } from "bun:test";
import { CANONICAL_PLAYER_ONE } from "@tcg/shared/testing";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { namaariResoluteDaughter } from "./182-namaari-resolute-daughter";

const weakDefenderA = createMockCharacter({
  id: "namaari-test-weak-defender-a",
  name: "Weak Defender A",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const weakDefenderB = createMockCharacter({
  id: "namaari-test-weak-defender-b",
  name: "Weak Defender B",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const strongAttackerA = createMockCharacter({
  id: "namaari-test-strong-attacker-a",
  name: "Strong Attacker A",
  cost: 1,
  strength: 5,
  willpower: 5,
});

const strongAttackerB = createMockCharacter({
  id: "namaari-test-strong-attacker-b",
  name: "Strong Attacker B",
  cost: 1,
  strength: 5,
  willpower: 5,
});

describe("Namaari - Resolute Daughter", () => {
  describe("I DON'T HAVE ANY OTHER CHOICE - For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character.", () => {
    it("costs full cost when no opposing characters banished in challenge this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [namaariResoluteDaughter],
          inkwell: namaariResoluteDaughter.cost,
          deck: 2,
        },
        {
          play: [{ card: weakDefenderA, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(namaariResoluteDaughter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(namaariResoluteDaughter)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("costs 2 less when 1 opposing character is banished in a challenge this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [namaariResoluteDaughter],
          inkwell: namaariResoluteDaughter.cost - 2,
          play: [strongAttackerA],
          deck: 2,
        },
        {
          play: [{ card: weakDefenderA, exerted: true }],
        },
      );

      // Challenge and banish the weak defender
      expect(
        testEngine.asPlayerOne().challenge(strongAttackerA, weakDefenderA),
      ).toBeSuccessfulCommand();
      expect(testEngine.getCard(weakDefenderA)).toBeInZone("discard");

      // Now Namaari should cost 2 less
      expect(testEngine.asPlayerOne().playCard(namaariResoluteDaughter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(namaariResoluteDaughter)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("costs 4 less when 2 opposing characters are banished in challenges this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [namaariResoluteDaughter],
          inkwell: namaariResoluteDaughter.cost - 4,
          play: [strongAttackerA, strongAttackerB],
          deck: 2,
        },
        {
          play: [
            { card: weakDefenderA, exerted: true },
            { card: weakDefenderB, exerted: true },
          ],
        },
      );

      // Challenge and banish two weak defenders
      expect(
        testEngine.asPlayerOne().challenge(strongAttackerA, weakDefenderA),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().challenge(strongAttackerB, weakDefenderB),
      ).toBeSuccessfulCommand();

      // Now Namaari should cost 4 less (2 per banished)
      expect(testEngine.asPlayerOne().playCard(namaariResoluteDaughter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(namaariResoluteDaughter)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("cannot be played when insufficient ink even with cost reduction from banished characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [namaariResoluteDaughter],
          inkwell: namaariResoluteDaughter.cost - 3,
          play: [strongAttackerA],
          deck: 2,
        },
        {
          play: [{ card: weakDefenderA, exerted: true }],
        },
      );

      // Banish 1 opponent character => 2 ink reduction, but we need 3 more
      expect(
        testEngine.asPlayerOne().challenge(strongAttackerA, weakDefenderA),
      ).toBeSuccessfulCommand();

      const result = testEngine.asPlayerOne().playCard(namaariResoluteDaughter);
      expect(result).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(namaariResoluteDaughter)).toBe("hand");
    });
  });

  describe("Resist +3", () => {
    it("has Resist +3 keyword", () => {
      expect(
        namaariResoluteDaughter.abilities?.some(
          (a) => a.type === "keyword" && a.keyword === "Resist" && a.value === 3,
        ),
      ).toBe(true);
    });
  });
});
