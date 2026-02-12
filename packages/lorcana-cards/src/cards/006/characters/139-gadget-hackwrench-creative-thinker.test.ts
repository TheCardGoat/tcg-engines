// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { gadgetHackwrenchCreativeThinker } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gadget Hackwrench - Creative Thinker", () => {
//   It.skip("BRAINSTORM Whenever you play an item, this character gets +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: gadgetHackwrenchCreativeThinker.cost,
//       Play: [gadgetHackwrenchCreativeThinker],
//       Hand: [gadgetHackwrenchCreativeThinker],
//     });
//
//     Await testEngine.playCard(gadgetHackwrenchCreativeThinker);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
