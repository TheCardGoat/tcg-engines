// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseDetective } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import {
//   ChipFriendIndeed,
//   ChipNDaleRecoveryRangers,
//   DaleFriendInNeed,
//   DawsonBasilsAssistant,
//   GadgetHackwrenchPerceptiveMouse,
//   RafikiShamanOfTheSavanna,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Chip 'n' Dale - Recovery Rangers", () => {
//   Describe("Shift", () => {
//     It("Shifts from Dale", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Hand: [chipNDaleRecoveryRangers],
//         Play: [daleFriendInNeed],
//       });
//
//       Const { shifter } = await testEngine.shiftCard({
//         Shifted: daleFriendInNeed,
//         Shifter: chipNDaleRecoveryRangers,
//       });
//
//       Expect(shifter.zone).toEqual("play");
//     });
//
//     It("Shifts from Chip", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Hand: [chipNDaleRecoveryRangers],
//         Play: [chipFriendIndeed],
//       });
//
//       Const { shifter } = await testEngine.shiftCard({
//         Shifted: chipFriendIndeed,
//         Shifter: chipNDaleRecoveryRangers,
//       });
//
//       Expect(shifter.zone).toEqual("play");
//     });
//   });
//
//   Describe("Search And Rescue", () => {
//     It("During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: mickeyMouseDetective.cost + mickeyMouseDetective.cost,
//         Deck: 2,
//         Hand: [
//           RafikiShamanOfTheSavanna,
//           MickeyMouseDetective,
//           TipoGrowingSon,
//           DawsonBasilsAssistant,
//         ],
//         Discard: [gadgetHackwrenchPerceptiveMouse],
//         Play: [chipNDaleRecoveryRangers],
//       });
//
//       Await testEngine.putIntoInkwell(rafikiShamanOfTheSavanna);
//       Expect(testEngine.stackLayers).toHaveLength(1);
//       Await testEngine.skipTopOfStack();
//
//       Await testEngine.playCard(mickeyMouseDetective);
//       Await testEngine.acceptOptionalLayer();
//       Expect(testEngine.stackLayers).toHaveLength(1);
//       Await testEngine.skipTopOfStack();
//
//       Await testEngine.playCard(
//         TipoGrowingSon,
//         {
//           Targets: [dawsonBasilsAssistant],
//         },
//         True,
//       );
//       Expect(testEngine.stackLayers).toHaveLength(1);
//       Await testEngine.skipTopOfStack();
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
