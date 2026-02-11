// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { johnSilverShipsCook } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("John Silver - Ship's Cook", () => {
//   It.skip("HUNK OF HARDWARE When you play this character, chosen character can't challenge during their next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: johnSilverShipsCook.cost,
//       Hand: [johnSilverShipsCook],
//     });
//
//     Await testEngine.playCard(johnSilverShipsCook);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
