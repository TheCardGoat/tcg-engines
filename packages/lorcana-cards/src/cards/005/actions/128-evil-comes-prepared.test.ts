// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { theQueenRegalMonarch } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { evilComesPrepared } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Evil Comes Prepared", () => {
//   It("Ready chosen character of yours. They can’t quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.", () => {
//     Const testEngine = new TestEngine({
//       Inkwell: evilComesPrepared.cost,
//       Hand: [evilComesPrepared],
//       Play: [deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(evilComesPrepared);
//     Const targetCard = testEngine.getCardModel(deweyLovableShowoff);
//
//     TargetCard.exert();
//     Expect(targetCard.exerted).toBe(true);
//
//     TestEngine.playCard(cardUnderTest);
//
//     TestEngine.resolveTopOfStack({ targets: [targetCard] });
//     Expect(targetCard.exerted).toBe(false);
//
//     Expect(targetCard.hasQuestRestriction).toBe(true);
//
//     Expect(testEngine.getPlayerLore()).toEqual(0);
//   });
//
//   It("If a Villain character is chosen, gain 1 lore.", () => {
//     Const testEngine = new TestEngine({
//       Inkwell: evilComesPrepared.cost,
//       Hand: [evilComesPrepared],
//       Play: [theQueenRegalMonarch],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(evilComesPrepared);
//     Const targetCard = testEngine.getCardModel(theQueenRegalMonarch);
//
//     TargetCard.exert();
//     Expect(targetCard.exerted).toBe(true);
//
//     TestEngine.playCard(cardUnderTest);
//
//     TestEngine.resolveTopOfStack({ targets: [targetCard] });
//     Expect(targetCard.exerted).toBe(false);
//
//     Expect(targetCard.hasQuestRestriction).toBe(true);
//
//     Expect(testEngine.getPlayerLore()).toEqual(1);
//   });
//
//   It("If a Villain character not chosen but in play, gain 0 lore.", () => {
//     Const testEngine = new TestEngine({
//       Inkwell: evilComesPrepared.cost,
//       Hand: [evilComesPrepared],
//       Play: [theQueenRegalMonarch, deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(evilComesPrepared);
//     Const targetCard = testEngine.getCardModel(deweyLovableShowoff);
//
//     TargetCard.exert();
//     Expect(targetCard.exerted).toBe(true);
//
//     TestEngine.playCard(cardUnderTest);
//
//     TestEngine.resolveTopOfStack({ targets: [targetCard] });
//     Expect(targetCard.exerted).toBe(false);
//
//     Expect(targetCard.hasQuestRestriction).toBe(true);
//
//     Expect(testEngine.getPlayerLore()).toEqual(0);
//   });
// });
//
