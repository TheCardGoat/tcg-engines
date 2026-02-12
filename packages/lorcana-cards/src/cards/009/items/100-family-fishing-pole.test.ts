// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { familyFishingPole } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Family Fishing Pole", () => {
//   It("WATCH CLOSELY This item enters play exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: familyFishingPole.cost,
//       Hand: [familyFishingPole],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(familyFishingPole);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Expect(cardUnderTest.exerted).toBe(true);
//   });
//
//   It("THE PERFECT CAST {E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 1,
//       Play: [familyFishingPole, deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(familyFishingPole);
//     Const targetCard = testEngine.getCardModel(deweyLovableShowoff);
//     TargetCard.exert();
//
//     // await testEngine.activateCard(cardUnderTest);
//
//     CardUnderTest.activate("THE PERFECT CAST");
//
//     // await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     Expect(cardUnderTest.zone).toBe("discard");
//     Expect(targetCard.zone).toBe("hand");
//     Expect(testEngine.getPlayerLore()).toBe(2);
//   });
// });
//
