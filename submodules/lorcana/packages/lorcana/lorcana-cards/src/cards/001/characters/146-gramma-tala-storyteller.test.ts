import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { grammaTalaStoryteller } from "./146-gramma-tala-storyteller";

const strongAttacker = createMockCharacter({
  id: "gramma-tala-test-attacker",
  name: "Strong Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
});

describe("Gramma Tala - Storyteller", () => {
  describe("I WILL BE WITH YOU - When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
    it("puts Gramma Tala into your inkwell facedown and exerted when you accept the trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: grammaTalaStoryteller, exerted: true }],
          deck: 1,
        },
        {
          play: [strongAttacker],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, grammaTalaStoryteller),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(grammaTalaStoryteller)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(grammaTalaStoryteller, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(grammaTalaStoryteller)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(grammaTalaStoryteller)).toBe(true);
      expect(testEngine.getCardPublicFaceState(grammaTalaStoryteller, "inkwell")).toBe("faceDown");
    });

    it("leaves Gramma Tala in discard when you decline the trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: grammaTalaStoryteller, exerted: true }],
          deck: 1,
        },
        {
          play: [strongAttacker],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, grammaTalaStoryteller),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(grammaTalaStoryteller, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(grammaTalaStoryteller)).toBe("discard");
    });
  });
});
