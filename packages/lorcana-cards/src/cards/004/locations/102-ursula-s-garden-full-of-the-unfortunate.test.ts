// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HadesMeticulousPlotter,
//   TukTukCuriousPartner,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { ursulasGardenFullOfTheUnfortunate } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ursula's Garden - Full of the Unfortunate", () => {
//   It("**Abandon Hope** While you have an exerted character here, opposing characters get -1 {L}.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: ursulasGardenFullOfTheUnfortunate.moveCost,
//         Play: [ursulasGardenFullOfTheUnfortunate, tukTukCuriousPartner],
//       },
//       {
//         Play: [hadesMeticulousPlotter],
//       },
//     );
//
//     Const targetCard = testEngine.getCardModel(hadesMeticulousPlotter);
//
//     Await testEngine.moveToLocation({
//       Location: ursulasGardenFullOfTheUnfortunate,
//       Character: tukTukCuriousPartner,
//     });
//
//     Expect(targetCard.lore).toEqual(hadesMeticulousPlotter.lore);
//     Await testEngine.tapCard(tukTukCuriousPartner);
//     Expect(targetCard.lore).toEqual(hadesMeticulousPlotter.lore - 1);
//   });
// });
//
