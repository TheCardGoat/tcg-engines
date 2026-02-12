// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { coldstoneReincarnatedCyborg } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Coldstone - Reincarnated Cyborg", () => {
//   It.skip("THE CANTRIPS HAVE BEEN SPOKEN When you play this character, if you have 2 or more Gargoyle character cards in your discard, gain 2 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: coldstoneReincarnatedCyborg.cost,
//       Hand: [coldstoneReincarnatedCyborg],
//     });
//
//     Await testEngine.playCard(coldstoneReincarnatedCyborg);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
