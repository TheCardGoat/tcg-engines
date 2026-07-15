// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChemPurse,
//   IceSpikes,
//   JumbaJookibaCriticalScientist,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ice Spikes", () => {
//   It("HOLD STILL When you play this item, exert chosen opposing character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: iceSpikes.cost,
//         Hand: [iceSpikes],
//       },
//       {
//         Play: [jumbaJookibaCriticalScientist],
//       },
//     );
//
//     Await testEngine.playCard(iceSpikes);
//     Await testEngine.resolveTopOfStack({
//       Targets: [jumbaJookibaCriticalScientist],
//     });
//   });
//
//   It("IT'S STUCK {E}, 1 {I} – Exert chosen opposing item. It can’t ready at the start of its next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 1,
//         Play: [iceSpikes],
//       },
//       {
//         Play: [chemPurse],
//       },
//     );
//
//     Await testEngine.activateCard(iceSpikes, { targets: [chemPurse] });
//
//     Expect(testEngine.getCardModel(iceSpikes).exerted).toBe(true);
//     Expect(testEngine.getCardModel(chemPurse).exerted).toBe(true);
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(chemPurse).exerted).toBe(true);
//   });
// });
//
