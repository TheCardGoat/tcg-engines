// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { lefouInstigator } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Lefou - Instigator", () => {
//   it.skip("**FAN THE FLAMES** When you play this character, ready chosen character. They can't quest for the rest of this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: lefouInstigator.cost,
//       hand: [lefouInstigator],
//     });
//
//     await testEngine.playCard(lefouInstigator);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
