// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { befuddle } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { tamatoaSoShiny } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { retrosphere } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import {
//   FlotillaCoconutArmada,
//   MaleficentsStaff,
//   MertleEdmondsLilosRival,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Maleficent's Staff", () => {
//   Describe("BACK, FOOLS! Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.", () => {
//     It("should gain 1 lore when an opponent's ITEM is returned to their hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: befuddle.cost,
//           Play: [maleficentsStaff],
//           Hand: [befuddle],
//         },
//         {
//           Play: [dingleHopper],
//         },
//       );
//
//       Await testEngine.playCard(befuddle, { targets: [dingleHopper] });
//
//       Expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//     });
//
//     It("should gain 1 lore when an opponent's CHARACTER is returned to their hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 2,
//           Play: [maleficentsStaff, retrosphere],
//           Hand: [befuddle],
//         },
//         {
//           Play: [mertleEdmondsLilosRival],
//         },
//       );
//
//       Await testEngine.activateCard(retrosphere, {
//         Targets: [mertleEdmondsLilosRival],
//       });
//
//       Expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//     });
//
//     It("should gain 1 lore when an opponent's LOCATION is returned to their hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 2,
//           Play: [maleficentsStaff, retrosphere],
//           Hand: [befuddle],
//         },
//         {
//           Play: [flotillaCoconutArmada],
//         },
//       );
//
//       Await testEngine.activateCard(retrosphere, {
//         Targets: [flotillaCoconutArmada],
//       });
//
//       Expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("should not gain lore when a card is returned to hand from discard", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: tamatoaSoShiny.cost,
//         Hand: [tamatoaSoShiny],
//         Discard: [dingleHopper],
//       },
//       {
//         Play: [maleficentsStaff],
//       },
//     );
//
//     Await testEngine.playCard(tamatoaSoShiny, {
//       Targets: [dingleHopper],
//       AcceptOptionalLayer: true,
//     });
//
//     Expect(testEngine.getLoreForPlayer("player_two")).toBe(0);
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
