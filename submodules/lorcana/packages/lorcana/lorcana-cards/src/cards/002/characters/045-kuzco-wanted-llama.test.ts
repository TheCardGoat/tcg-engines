import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { kuzcoWantedLlama } from "./045-kuzco-wanted-llama";

describe("Kuzco - Wanted Llama", () => {
  describe("OK, WHERE AM I? — When this character is banished, you may draw a card.", () => {
    it("puts a bag effect when Kuzco is banished via damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [kuzcoWantedLlama],
        deck: 1,
      });

      const kuzcoId = testEngine.findCardInstanceId(kuzcoWantedLlama, "play");

      expect(
        testEngine.asServer().manualSetDamage(kuzcoId, kuzcoWantedLlama.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(kuzcoWantedLlama)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("draws a card when the optional trigger is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [kuzcoWantedLlama],
        deck: 2,
      });

      const kuzcoId = testEngine.findCardInstanceId(kuzcoWantedLlama, "play");
      const handCountBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(
        testEngine.asServer().manualSetDamage(kuzcoId, kuzcoWantedLlama.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kuzcoWantedLlama, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(
        handCountBefore + 1,
      );
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not draw a card when the optional trigger is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [kuzcoWantedLlama],
        deck: 2,
      });

      const kuzcoId = testEngine.findCardInstanceId(kuzcoWantedLlama, "play");
      const handCountBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(
        testEngine.asServer().manualSetDamage(kuzcoId, kuzcoWantedLlama.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kuzcoWantedLlama, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(handCountBefore);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("triggers when Kuzco is banished in a challenge", () => {
      const strongOpponent = {
        ...kuzcoWantedLlama,
        id: "kuzco-test-opponent",
        canonicalId: "ci_kuzco-test-opponent",
        strength: 5,
        willpower: 5,
      };

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kuzcoWantedLlama, exerted: true }],
          deck: 2,
        },
        {
          play: [strongOpponent],
        },
      );

      // Pass to opponent's turn so player two has priority
      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().challenge(strongOpponent, kuzcoWantedLlama),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(kuzcoWantedLlama)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });
  });
});
