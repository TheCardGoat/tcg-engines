// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BillTheLizardChimneySweep,
//   DeweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bill The Lizard - Chimney Sweep", () => {
//   It("NOTHING TO IT While another character in play has damage, this character gains Evasive. (Only characters with Evasive can challenge them.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [billTheLizardChimneySweep, deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(billTheLizardChimneySweep);
//     Const otherCard = testEngine.getCardModel(deweyLovableShowoff);
//
//     Expect(cardUnderTest.hasEvasive).toBe(false);
//
//     Await testEngine.setCardDamage(otherCard, 1);
//
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
