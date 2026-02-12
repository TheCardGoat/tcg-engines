// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { candleheadDedicatedRacer } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Candlehead - Dedicated Racer", () => {
//   It.skip("WINNING ISN'T EVERYTHING When this character is banished, you may remove up to 2 damage from chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: candleheadDedicatedRacer.cost,
//       Play: [candleheadDedicatedRacer],
//       Hand: [candleheadDedicatedRacer],
//     });
//
//     Await testEngine.playCard(candleheadDedicatedRacer);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
