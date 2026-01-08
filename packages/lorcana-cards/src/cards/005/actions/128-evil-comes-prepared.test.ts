// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { theQueenRegalMonarch } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { evilComesPrepared } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Evil Comes Prepared", () => {
//   it("Ready chosen character of yours. They can’t quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.", () => {
//     const testEngine = new TestEngine({
//       inkwell: evilComesPrepared.cost,
//       hand: [evilComesPrepared],
//       play: [deweyLovableShowoff],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(evilComesPrepared);
//     const targetCard = testEngine.getCardModel(deweyLovableShowoff);
//
//     targetCard.exert();
//     expect(targetCard.exerted).toBe(true);
//
//     testEngine.playCard(cardUnderTest);
//
//     testEngine.resolveTopOfStack({ targets: [targetCard] });
//     expect(targetCard.exerted).toBe(false);
//
//     expect(targetCard.hasQuestRestriction).toBe(true);
//
//     expect(testEngine.getPlayerLore()).toEqual(0);
//   });
//
//   it("If a Villain character is chosen, gain 1 lore.", () => {
//     const testEngine = new TestEngine({
//       inkwell: evilComesPrepared.cost,
//       hand: [evilComesPrepared],
//       play: [theQueenRegalMonarch],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(evilComesPrepared);
//     const targetCard = testEngine.getCardModel(theQueenRegalMonarch);
//
//     targetCard.exert();
//     expect(targetCard.exerted).toBe(true);
//
//     testEngine.playCard(cardUnderTest);
//
//     testEngine.resolveTopOfStack({ targets: [targetCard] });
//     expect(targetCard.exerted).toBe(false);
//
//     expect(targetCard.hasQuestRestriction).toBe(true);
//
//     expect(testEngine.getPlayerLore()).toEqual(1);
//   });
//
//   it("If a Villain character not chosen but in play, gain 0 lore.", () => {
//     const testEngine = new TestEngine({
//       inkwell: evilComesPrepared.cost,
//       hand: [evilComesPrepared],
//       play: [theQueenRegalMonarch, deweyLovableShowoff],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(evilComesPrepared);
//     const targetCard = testEngine.getCardModel(deweyLovableShowoff);
//
//     targetCard.exert();
//     expect(targetCard.exerted).toBe(true);
//
//     testEngine.playCard(cardUnderTest);
//
//     testEngine.resolveTopOfStack({ targets: [targetCard] });
//     expect(targetCard.exerted).toBe(false);
//
//     expect(targetCard.hasQuestRestriction).toBe(true);
//
//     expect(testEngine.getPlayerLore()).toEqual(0);
//   });
// });
//
