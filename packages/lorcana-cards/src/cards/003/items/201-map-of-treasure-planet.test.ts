// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { mapOfTreasurePlanet } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { bellesHouseMauricesWorkshop } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Map of Treasure Planet", () => {
//   It("**KEY TO THE PORTAL** {E} – You pay 1 {I} less for the next location you play this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: bellesHouseMauricesWorkshop.cost - 1,
//       Hand: [bellesHouseMauricesWorkshop],
//       Play: [mapOfTreasurePlanet],
//     });
//
//     Const location = testEngine.getCardModel(bellesHouseMauricesWorkshop);
//
//     Expect(location.cost).toEqual(bellesHouseMauricesWorkshop.cost);
//     Await testEngine.activateCard(mapOfTreasurePlanet);
//     Expect(location.cost).toEqual(bellesHouseMauricesWorkshop.cost - 1);
//
//     Await testEngine.playCard(bellesHouseMauricesWorkshop);
//
//     Expect(location.zone).toEqual("play");
//   });
//
//   It("**Show the Way** You pay 1 {I} less to move your characters to a location.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mapOfTreasurePlanet.cost,
//       Hand: [mapOfTreasurePlanet],
//       Play: [bellesHouseMauricesWorkshop, mickeyBraveLittleTailor],
//     });
//
//     Const location = testEngine.getCardModel(bellesHouseMauricesWorkshop);
//     Const char = testEngine.getCardModel(mickeyBraveLittleTailor);
//
//     Expect(location.moveCostToEnterLocation(char)).toEqual(
//       BellesHouseMauricesWorkshop.moveCost,
//     );
//
//     Await testEngine.playCard(mapOfTreasurePlanet);
//
//     Expect(testEngine.getCardModel(mapOfTreasurePlanet).zone).toEqual("play");
//     Expect(location.moveCostToEnterLocation(char)).toEqual(
//       BellesHouseMauricesWorkshop.moveCost - 1,
//     );
//   });
// });
//
