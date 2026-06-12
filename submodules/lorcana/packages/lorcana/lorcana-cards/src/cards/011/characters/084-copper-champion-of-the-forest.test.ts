import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { moanaOfMotunui } from "../../001/characters/014-moana-of-motunui";
import { tinkerBellMostHelpful } from "../../001/characters/093-tinker-bell-most-helpful";
import { copperChampionOfTheForest } from "./084-copper-champion-of-the-forest";
import { copperOnTheScent } from "./107-copper-on-the-scent";

const evasiveCharacter = createMockCharacter({
  id: "copper-forest-evasive-ally",
  name: "Evasive Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  abilities: [
    { id: "copper-forest-evasive-ally-kw", keyword: "Evasive", type: "keyword", text: "Evasive" },
  ],
});

const secondEvasiveCharacter = createMockCharacter({
  id: "copper-forest-evasive-ally-2",
  name: "Second Evasive Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  abilities: [
    { id: "copper-forest-evasive-ally-2-kw", keyword: "Evasive", type: "keyword", text: "Evasive" },
  ],
});

const nonEvasiveCharacter = createMockCharacter({
  id: "copper-forest-non-evasive",
  name: "Non Evasive Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Copper - Champion of the Forest", () => {
  describe("Shift 3", () => {
    it("can be played on top of a character named Copper for 3 ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 3,
        play: [copperOnTheScent],
        hand: [copperChampionOfTheForest],
        deck: 5,
      });

      const shiftTarget = testEngine.findCardInstanceId(copperOnTheScent, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(copperChampionOfTheForest, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(copperChampionOfTheForest)).toBe("play");
    });

    it("cannot shift onto a character not named Copper", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 3,
        play: [moanaOfMotunui],
        hand: [copperChampionOfTheForest],
        deck: 5,
      });

      const shiftTarget = testEngine.findCardInstanceId(moanaOfMotunui, "play", PLAYER_ONE);

      const result = testEngine.asPlayerOne().playCard(copperChampionOfTheForest, {
        cost: { cost: "shift", shiftTarget },
      });

      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(copperChampionOfTheForest)).toBe("hand");
    });
  });

  describe("MORE TO EXPLORE - Whenever this character quests, your characters with Evasive get +1 Lore this turn", () => {
    it("gives +1 lore to characters with Evasive when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [copperChampionOfTheForest, tinkerBellMostHelpful],
        deck: 5,
      });

      const initialLore = testEngine.asPlayerOne().getCardLore(tinkerBellMostHelpful);

      expect(testEngine.asPlayerOne().quest(copperChampionOfTheForest)).toBeSuccessfulCommand();

      // Resolve the triggered ability (MORE TO EXPLORE)
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolveOnlyBag();
      }

      expect(testEngine.asPlayerOne().getCardLore(tinkerBellMostHelpful)).toBe(initialLore + 1);
    });

    it("gives +1 lore to multiple characters with Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [copperChampionOfTheForest, evasiveCharacter, secondEvasiveCharacter],
        deck: 5,
      });

      const initialLore1 = testEngine.asPlayerOne().getCardLore(evasiveCharacter);
      const initialLore2 = testEngine.asPlayerOne().getCardLore(secondEvasiveCharacter);

      expect(testEngine.asPlayerOne().quest(copperChampionOfTheForest)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolveOnlyBag();
      }

      expect(testEngine.asPlayerOne().getCardLore(evasiveCharacter)).toBe(initialLore1 + 1);
      expect(testEngine.asPlayerOne().getCardLore(secondEvasiveCharacter)).toBe(initialLore2 + 1);
    });

    it("does not give +1 lore to characters without Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [copperChampionOfTheForest, nonEvasiveCharacter],
        deck: 5,
      });

      const initialLore = testEngine.asPlayerOne().getCardLore(nonEvasiveCharacter);

      expect(testEngine.asPlayerOne().quest(copperChampionOfTheForest)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolveOnlyBag();
      }

      expect(testEngine.asPlayerOne().getCardLore(nonEvasiveCharacter)).toBe(initialLore);
    });

    it("lore bonus lasts only for the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [copperChampionOfTheForest, tinkerBellMostHelpful],
        deck: 5,
      });

      const initialLore = testEngine.asPlayerOne().getCardLore(tinkerBellMostHelpful);

      expect(testEngine.asPlayerOne().quest(copperChampionOfTheForest)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolveOnlyBag();
      }

      expect(testEngine.asPlayerOne().getCardLore(tinkerBellMostHelpful)).toBe(initialLore + 1);

      // Pass turns
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Lore bonus should be gone
      expect(testEngine.asPlayerOne().getCardLore(tinkerBellMostHelpful)).toBe(initialLore);
    });

    it("Copper itself does NOT get +1 lore if it lacks Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [copperChampionOfTheForest],
        deck: 5,
      });

      // Copper does not have Evasive by default
      expect(testEngine.hasKeyword(copperChampionOfTheForest, "Evasive")).toBe(false);

      const initialCopperLore = testEngine.asPlayerOne().getCardLore(copperChampionOfTheForest);

      expect(testEngine.asPlayerOne().quest(copperChampionOfTheForest)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolveOnlyBag();
      }

      // Copper should not gain +1 lore from its own MORE TO EXPLORE trigger
      expect(testEngine.asPlayerOne().getCardLore(copperChampionOfTheForest)).toBe(
        initialCopperLore,
      );
    });
  });
});
