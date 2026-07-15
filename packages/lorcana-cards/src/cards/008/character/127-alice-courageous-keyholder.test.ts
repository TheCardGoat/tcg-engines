// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AliceCourageousKeyholder,
//   DeweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Alice - Courageous Keyholder", () => {
//   It("THIS WAY OUT When you play this character, you may ready chosen damaged character of yours. They can't quest for the rest of this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: aliceCourageousKeyholder.cost,
//       Hand: [aliceCourageousKeyholder],
//       Play: [deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(aliceCourageousKeyholder);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//     Target.exert();
//     TestEngine.setCardDamage(target, 1);
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.exerted).toEqual(false);
//     Expect(target.hasQuestRestriction).toEqual(true);
//   });
// });
//
