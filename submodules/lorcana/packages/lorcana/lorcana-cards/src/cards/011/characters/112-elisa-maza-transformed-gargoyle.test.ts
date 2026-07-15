import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { elisaMazaTransformedGargoyle } from "./112-elisa-maza-transformed-gargoyle";
import { hiddenTrap } from "../items/170-hidden-trap";

const allyCharacter = createMockCharacter({
  id: "ally-char",
  name: "Ally Character",
  strength: 3,
  willpower: 3,
  cost: 2,
});

describe("Elisa Maza - Transformed Gargoyle", () => {
  describe("FOREVER STRONG", () => {
    it("should prevent strength reduction below printed value", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [elisaMazaTransformedGargoyle, allyCharacter],
          deck: 2,
        },
        {
          play: [hiddenTrap],
          deck: 2,
        },
      );

      // P1 passes turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // P2 uses Hidden Trap to apply -2 strength to P1's ally character (printed strength 3)
      expect(
        testEngine.asPlayerTwo().activateAbility(hiddenTrap, {
          choiceIndex: 1,
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      // With FOREVER STRONG active, strength should not go below printed value (3)
      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(3);
    });

    it("should allow strength reduction without Elisa in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [allyCharacter],
          deck: 2,
        },
        {
          play: [hiddenTrap],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().activateAbility(hiddenTrap, {
          choiceIndex: 1,
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Without Elisa, strength should be reduced to 1 (3 - 2)
      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(1);
    });
  });

  // Note: STONE BY DAY (cant-ready with 3+ cards in hand) is a static conditional restriction.
  // The engine's ready phase currently checks hasTemporaryRestriction but does not evaluate
  // static conditional restrictions for cant-ready. Tests will be added once the engine
  // supports static cant-ready restrictions during the ready phase.
});
