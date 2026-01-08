// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { candleheadDedicatedRacer } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Candlehead - Dedicated Racer", () => {
//   it.skip("WINNING ISN'T EVERYTHING When this character is banished, you may remove up to 2 damage from chosen character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: candleheadDedicatedRacer.cost,
//       play: [candleheadDedicatedRacer],
//       hand: [candleheadDedicatedRacer],
//     });
//
//     await testEngine.playCard(candleheadDedicatedRacer);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
