// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   SapphireCoil,
//   SteelCoil,
//   TamatoaHappyAsAClam,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tamatoa - Happy as a Clam", () => {
//   It("COOLEST COLLECTION When you play this character, return up to 2 item cards from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: tamatoaHappyAsAClam.cost,
//       Discard: [steelCoil, sapphireCoil],
//       Hand: [tamatoaHappyAsAClam],
//     });
//
//     Await testEngine.playCard(tamatoaHappyAsAClam, {
//       Targets: [sapphireCoil, steelCoil],
//     });
//
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Hand: 2,
//         Discard: 0,
//       }),
//     );
//   });
//
//   It.skip("I'M BEAUTIFUL, BABY! Whenever this character quests, you may play an item for free.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: tamatoaHappyAsAClam.cost,
//       Play: [tamatoaHappyAsAClam],
//       Hand: [tamatoaHappyAsAClam],
//     });
//
//     Await testEngine.playCard(tamatoaHappyAsAClam);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
