// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mulanDisguisedSoldier } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mulan - Disguised Soldier", () => {
//   It.skip("WHERE DO I SIGN IN? When you play this character, you may draw a card, then choose and discard a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mulanDisguisedSoldier.cost,
//       Hand: [mulanDisguisedSoldier],
//     });
//
//     Await testEngine.playCard(mulanDisguisedSoldier);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
