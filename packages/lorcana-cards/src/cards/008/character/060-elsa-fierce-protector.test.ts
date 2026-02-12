// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BambiPrinceOfTheForest,
//   DeweyLovableShowoff,
//   ElsaFierceProtector,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Elsa - Fierce Protector", () => {
//   It("ICE OVER 1 {I}, Choose and discard a card – Exert chosen opposing character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 1,
//         Hand: [bambiPrinceOfTheForest],
//         Play: [elsaFierceProtector],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(elsaFierceProtector);
//     Const cardInHand = testEngine.getCardModel(bambiPrinceOfTheForest);
//     Const targetCard = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.activateCard(cardUnderTest, { costs: [cardInHand] });
//     Await testEngine.resolveTopOfStack({ targets: [targetCard] }, true);
//
//     Expect(targetCard.exerted).toBe(true);
//   });
// });
//
