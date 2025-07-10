/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  allCardsById,
  type LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { characterCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import {
  evasiveAbility,
  recklessAbility,
  rushAbility,
  yourOtherCharactersWithGain,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import { cursedMerfolkUrsulasHandiwork } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const testCardOne: LorcanitoCharacterCard = {
  ...characterCardMock,
  id: "testCard-gives-evasive-to-rush",
  abilities: [
    evasiveAbility,
    yourOtherCharactersWithGain({
      name: "**Rush** gain **Evasive**.",
      text: "Your other characters with **Rush** gain **Evasive**.",
      gainedAbility: evasiveAbility,
      filter: { filter: "ability", value: "rush" },
    }),
  ],
};
allCardsById[testCardOne.id] = testCardOne;

const testCardTwo: LorcanitoCharacterCard = {
  ...characterCardMock,
  id: "testCard-gives-reckless-to-evasive",
  abilities: [
    recklessAbility,
    yourOtherCharactersWithGain({
      name: "**Evasive** gain **Reckless**.",
      text: "Your other characters with **Evasive** gain **Reckless**.",
      gainedAbility: recklessAbility,
      filter: { filter: "ability", value: "reckless" },
    }),
  ],
};
allCardsById[testCardTwo.id] = testCardTwo;

const testCardThree: LorcanitoCharacterCard = {
  ...characterCardMock,
  id: "testCard-gives-rush-to-reckless",
  abilities: [
    rushAbility,
    yourOtherCharactersWithGain({
      name: "**Reckless** gain **Rush**.",
      text: "Your other characters with **Reckless** gain **Rush**.",
      gainedAbility: recklessAbility,
      filter: { filter: "ability", value: "rush" },
    }),
  ],
};
allCardsById[testCardThree.id] = testCardThree;

// TODO: THIS TESTS ARE IMPORTANT, PLEASE FIX THEM
// describe("Complex scenarios that requires the engine to self reference cards in order to resolve abilities", () => {
//   it("Scenario 1: Your other characters with X, where the recursion happens on the target", () => {
//     const testStore = new TestStore({
//       play: [testCardOne, testCardTwo, testCardThree],
//     });

//     const cardOne = testStore.getCard(testCardOne);
//     const cardTwo = testStore.getCard(testCardTwo);
//     const cardThree = testStore.getCard(testCardThree);

//     [cardOne, cardTwo, cardThree].forEach((card) => {
//       expect(card.hasEvasive).toEqual(true);
//       expect(card.hasReckless).toEqual(true);
//       expect(card.hasRush).toEqual(true);
//     });
//   });

//   it("Scenario 2: Your other characters with X, where the recursion happens on the condition", () => {});
// });

// describe("Regression tests", () => {
//   it("Infinite loop when playing cursed merfolk", () => {
//     const testStore = new TestStore({
//       inkwell: cursedMerfolkUrsulasHandiwork.cost,
//       hand: [cursedMerfolkUrsulasHandiwork],
//     });

//     const cursedMerfolk = testStore.getCard(cursedMerfolkUrsulasHandiwork);
//     cursedMerfolk.playFromHand();
//   });
// });
