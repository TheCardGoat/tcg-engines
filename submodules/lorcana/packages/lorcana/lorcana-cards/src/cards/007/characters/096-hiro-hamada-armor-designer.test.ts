import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hiroHamadaArmorDesigner } from "./096-hiro-hamada-armor-designer";
import { hiroHamadaRoboticsProdigy } from "../../006/characters/145-hiro-hamada-robotics-prodigy";

const floodbornUnderCard = createMockCharacter({
  id: "hiro-floodborn-under",
  name: "Floodborn Under",
  cost: 3,
  classifications: ["Floodborn", "Hero"],
});

const floodbornNoCardsUnder = createMockCharacter({
  id: "hiro-floodborn-no-under",
  name: "Floodborn No Under",
  cost: 3,
  classifications: ["Floodborn", "Hero"],
});

const storybornWithCardsUnder = createMockCharacter({
  id: "hiro-storyborn-under",
  name: "Storyborn Under",
  cost: 3,
  classifications: ["Storyborn", "Hero"],
});

const underCard = createMockCharacter({
  id: "hiro-under-card",
  name: "Under Card",
  cost: 1,
});

describe("Hiro Hamada - Armor Designer", () => {
  describe("YOU CAN BE WAY MORE - Your Floodborn characters that have a card under them gain Evasive and Ward.", () => {
    it("grants Evasive and Ward to Floodborn character with card under", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hiroHamadaArmorDesigner, { card: floodbornUnderCard, cardsUnder: [underCard] }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(floodbornUnderCard, "Evasive")).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(floodbornUnderCard, "Ward")).toBe(true);
    });

    it("does not grant keywords to Floodborn character without card under", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hiroHamadaArmorDesigner, floodbornNoCardsUnder],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(floodbornNoCardsUnder, "Evasive")).toBe(false);
      expect(testEngine.asPlayerOne().hasKeyword(floodbornNoCardsUnder, "Ward")).toBe(false);
    });

    it("does not grant keywords to non-Floodborn character even with card under", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hiroHamadaArmorDesigner, { card: storybornWithCardsUnder, cardsUnder: [underCard] }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(storybornWithCardsUnder, "Evasive")).toBe(false);
      expect(testEngine.asPlayerOne().hasKeyword(storybornWithCardsUnder, "Ward")).toBe(false);
    });

    it("grants keywords to Hiro himself when shifted (has card under)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: hiroHamadaArmorDesigner, cardsUnder: [underCard] }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(hiroHamadaArmorDesigner, "Evasive")).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(hiroHamadaArmorDesigner, "Ward")).toBe(true);
    });

    it("does not grant keywords to Hiro himself without card under", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hiroHamadaArmorDesigner],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(hiroHamadaArmorDesigner, "Evasive")).toBe(false);
      expect(testEngine.asPlayerOne().hasKeyword(hiroHamadaArmorDesigner, "Ward")).toBe(false);
    });

    it("grants Evasive and Ward to Hiro after shifting onto a base character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [hiroHamadaArmorDesigner],
        play: [hiroHamadaRoboticsProdigy],
        inkwell: hiroHamadaArmorDesigner.cost - 2, // shift 5 cost
        deck: 5,
      });

      const shiftTarget = testEngine.findCardInstanceId(
        hiroHamadaRoboticsProdigy,
        "play",
        "player_one",
      );

      expect(
        testEngine.asPlayerOne().playCard(hiroHamadaArmorDesigner, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(hiroHamadaArmorDesigner, "Evasive")).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(hiroHamadaArmorDesigner, "Ward")).toBe(true);
    });
  });
});
