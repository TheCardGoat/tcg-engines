// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { coldstoneReincarnatedCyborg } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Coldstone - Reincarnated Cyborg", () => {
//   it.skip("THE CANTRIPS HAVE BEEN SPOKEN When you play this character, if you have 2 or more Gargoyle character cards in your discard, gain 2 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: coldstoneReincarnatedCyborg.cost,
//       hand: [coldstoneReincarnatedCyborg],
//     });
//
//     await testEngine.playCard(coldstoneReincarnatedCyborg);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
