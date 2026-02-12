// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { agustinMadrigalClumsyDad } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { kuzcoBoredRoyal } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kuzco - Bored Royal", () => {
//   It("LLAMA BREATH When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: kuzcoBoredRoyal.cost,
//         Hand: [kuzcoBoredRoyal],
//       },
//       {
//         Play: [agustinMadrigalClumsyDad],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(kuzcoBoredRoyal);
//     Const targetCard = testEngine.getCardModel(agustinMadrigalClumsyDad);
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     Expect(targetCard.zone).toEqual("hand");
//   });
// });
//
