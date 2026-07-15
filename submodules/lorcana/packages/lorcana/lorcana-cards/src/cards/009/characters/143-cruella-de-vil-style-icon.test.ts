import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { cruellaDeVilStyleIcon } from "./143-cruella-de-vil-style-icon";

const deckCardOne = createMockCharacter({
  id: "cruella-style-icon-deck-1",
  name: "Deck Card One",
  cost: 1,
});

const deckCardTwo = createMockCharacter({
  id: "cruella-style-icon-deck-2",
  name: "Deck Card Two",
  cost: 2,
});

const lowCostOpponentOne = createMockCharacter({
  id: "cruella-style-icon-low-cost-1",
  name: "Low Cost Opponent One",
  cost: 1,
  strength: 2,
  willpower: 2,
});

const lowCostOpponentTwo = createMockCharacter({
  id: "cruella-style-icon-low-cost-2",
  name: "Low Cost Opponent Two",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const highCostOpponent = createMockCharacter({
  id: "cruella-style-icon-high-cost",
  name: "High Cost Opponent",
  cost: 3,
  strength: 4,
  willpower: 4,
});

const banishChosenCharacterOne = createMockAction({
  id: "cruella-style-icon-banish-1",
  name: "Banish One",
  cost: 1,
  text: "Banish chosen character.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});

const banishChosenCharacterTwo = createMockAction({
  id: "cruella-style-icon-banish-2",
  name: "Banish Two",
  cost: 1,
  text: "Banish chosen character.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});

const banishChosenCharacterThree = createMockAction({
  id: "cruella-style-icon-banish-3",
  name: "Banish Three",
  cost: 1,
  text: "Banish chosen character.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});

describe("Cruella De Vil - Style Icon", () => {
  describe("OUT OF SEASON - Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.", () => {
    it("moves the top card of your deck into your inkwell the first time a low-cost character is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: [deckCardOne, deckCardTwo],
          hand: [banishChosenCharacterOne, banishChosenCharacterTwo],
          inkwell: 2,
          play: [cruellaDeVilStyleIcon],
        },
        {
          play: [lowCostOpponentOne, lowCostOpponentTwo],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(banishChosenCharacterOne, {
          targets: [lowCostOpponentOne],
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(cruellaDeVilStyleIcon),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(deckCardOne)).toBe("inkwell");

      expect(
        testEngine.asPlayerOne().playCard(banishChosenCharacterTwo, {
          targets: [lowCostOpponentTwo],
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(deckCardTwo)).toBe("deck");
    });

    it("does not trigger when a cost 3 character is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: [deckCardOne],
          hand: [banishChosenCharacterThree],
          inkwell: 1,
          play: [cruellaDeVilStyleIcon],
        },
        {
          play: [highCostOpponent],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(banishChosenCharacterThree, {
          targets: [highCostOpponent],
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(deckCardOne)).toBe("deck");
    });
  });

  describe("INSULTING REMARK - During your turn, each opposing character with cost 2 or less gets -1 {S}.", () => {
    it("reduces opposing low-cost characters and stops on the next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [cruellaDeVilStyleIcon],
        },
        {
          play: [lowCostOpponentOne, highCostOpponent],
        },
      );

      expect(testEngine.asPlayerTwo().getCardStrength(lowCostOpponentOne)).toBe(
        lowCostOpponentOne.strength - 1,
      );
      expect(testEngine.asPlayerTwo().getCardStrength(highCostOpponent)).toBe(
        highCostOpponent.strength,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(lowCostOpponentOne)).toBe(
        lowCostOpponentOne.strength,
      );
      expect(testEngine.asPlayerTwo().getCardStrength(highCostOpponent)).toBe(
        highCostOpponent.strength,
      );
    });
  });
});
