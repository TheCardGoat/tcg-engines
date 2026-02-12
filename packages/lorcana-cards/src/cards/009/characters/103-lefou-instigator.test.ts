// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { lefouInstigator } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lefou - Instigator", () => {
//   It.skip("**FAN THE FLAMES** When you play this character, ready chosen character. They can't quest for the rest of this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: lefouInstigator.cost,
//       Hand: [lefouInstigator],
//     });
//
//     Await testEngine.playCard(lefouInstigator);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
