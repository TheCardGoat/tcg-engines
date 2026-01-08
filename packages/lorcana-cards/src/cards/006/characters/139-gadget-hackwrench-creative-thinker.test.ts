// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { gadgetHackwrenchCreativeThinker } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Gadget Hackwrench - Creative Thinker", () => {
//   it.skip("BRAINSTORM Whenever you play an item, this character gets +1 {L} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: gadgetHackwrenchCreativeThinker.cost,
//       play: [gadgetHackwrenchCreativeThinker],
//       hand: [gadgetHackwrenchCreativeThinker],
//     });
//
//     await testEngine.playCard(gadgetHackwrenchCreativeThinker);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
