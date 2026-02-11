// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { belleBookworm } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   BaymaxsChargingStation,
//   BelleMechanicExtraordinaire,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Baymax's Charging Station", () => {
//   It("ENERGY CONVERTER Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Deck: 2,
//       Inkwell: belleMechanicExtraordinaire.cost + belleBookworm.cost,
//       Play: [baymaxsChargingStation],
//       Hand: [belleMechanicExtraordinaire, belleBookworm],
//     });
//
//     Await testEngine.playCard(belleBookworm);
//     Expect(testEngine.stackLayers.length).toBe(0);
//
//     Await testEngine.shiftCard({
//       Shifter: belleMechanicExtraordinaire,
//       Shifted: belleBookworm,
//     });
//     Expect(testEngine.stackLayers.length).toBe(1);
//
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 1,
//         Deck: 1,
//       }),
//     );
//   });
// });
//
