import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gantuGalacticFederationCaptain } from "./178-gantu-galactic-federation-captain";

const lowCostAttacker = createMockCharacter({
  id: "gantu-gfc-low-cost",
  name: "Low Cost Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const highCostAttacker = createMockCharacter({
  id: "gantu-gfc-high-cost",
  name: "High Cost Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const allyCharacter = createMockCharacter({
  id: "gantu-gfc-ally",
  name: "Ally Character",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Gantu - Galactic Federation Captain", () => {
  describe("UNDER ARREST", () => {
    it("character with cost 2 can't challenge Gantu", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [lowCostAttacker], deck: 1 },
        { play: [{ card: gantuGalacticFederationCaptain, exerted: true }], deck: 1 },
      );

      expect(
        testEngine.asPlayerOne().challenge(lowCostAttacker, gantuGalacticFederationCaptain).success,
      ).toBe(false);
    });

    it("character with cost 2 can't challenge other opponent characters either", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [lowCostAttacker], deck: 1 },
        { play: [gantuGalacticFederationCaptain, { card: allyCharacter, exerted: true }], deck: 1 },
      );

      expect(testEngine.asPlayerOne().challenge(lowCostAttacker, allyCharacter).success).toBe(
        false,
      );
    });

    it("character with cost 3 can challenge Gantu", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [highCostAttacker], deck: 1 },
        { play: [{ card: gantuGalacticFederationCaptain, exerted: true }], deck: 1 },
      );

      expect(
        testEngine.asPlayerOne().challenge(highCostAttacker, gantuGalacticFederationCaptain),
      ).toBeSuccessfulCommand();
    });
  });
});
