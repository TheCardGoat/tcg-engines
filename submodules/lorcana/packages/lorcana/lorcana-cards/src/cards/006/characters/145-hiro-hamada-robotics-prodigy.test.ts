import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { hiroHamadaRoboticsProdigy } from "./145-hiro-hamada-robotics-prodigy";

const robotCharacter = createMockCharacter({
  id: "hiro-robot-char",
  name: "Robot Friend",
  cost: 3,
  strength: 3,
  willpower: 3,
  classifications: ["Storyborn", "Robot"],
});

const mockItem = createMockItem({
  id: "hiro-test-item",
  name: "Test Item",
  cost: 2,
});

const nonRobotNonItem = createMockCharacter({
  id: "hiro-non-robot",
  name: "Non Robot",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Hero"],
});

describe("Hiro Hamada - Robotics Prodigy", () => {
  describe("SWEET TECH - {2} {E} - Search your deck for an item card or a Robot character card", () => {
    it("regression: exert ability to search deck for robot or item works", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: hiroHamadaRoboticsProdigy, isDrying: false }],
          inkwell: 2,
          deck: [nonRobotNonItem, robotCharacter, mockItem],
        },
        {
          deck: 2,
        },
      );

      // Activate SWEET TECH (costs 2 ink + exert)
      const result = testEngine.asPlayerOne().activateAbility(hiroHamadaRoboticsProdigy, {
        ability: "SWEET TECH",
      });

      expect(result).toBeSuccessfulCommand();

      // Hiro should be exerted after using the ability
      expect(testEngine.asPlayerOne().isExerted(hiroHamadaRoboticsProdigy)).toBe(true);
    });
  });
});
