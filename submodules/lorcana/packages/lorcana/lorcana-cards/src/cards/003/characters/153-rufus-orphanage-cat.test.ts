import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rufusOrphanageCat } from "./153-rufus-orphanage-cat";

const strongAttacker = createMockCharacter({
  id: "rufus-test-attacker",
  name: "Strong Attacker",
  cost: 3,
  strength: 5,
  willpower: 3,
});

describe("Rufus - Orphanage Cat", () => {
  describe("TOO OLD TO BE CHASING MICE - When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
    it("puts Rufus into your inkwell facedown and exerted when you accept the trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rufusOrphanageCat, exerted: true }],
          deck: 1,
        },
        {
          play: [strongAttacker],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, rufusOrphanageCat),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(rufusOrphanageCat)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rufusOrphanageCat, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(rufusOrphanageCat)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(rufusOrphanageCat)).toBe(true);
      expect(testEngine.getCardPublicFaceState(rufusOrphanageCat, "inkwell")).toBe("faceDown");
    });

    it("leaves Rufus in discard when you decline the trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rufusOrphanageCat, exerted: true }],
          deck: 1,
        },
        {
          play: [strongAttacker],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, rufusOrphanageCat),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(rufusOrphanageCat, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(rufusOrphanageCat)).toBe("discard");
    });
  });
});
