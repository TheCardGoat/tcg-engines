// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { akelaForestRunner } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// Import { whiteAgonyPlainsGoldenLagoon } from "@lorcanito/lorcana-engine/cards/010/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe.skip("White Agony Plains - Golden Lagoon", () => {
//   Describe.skip("PURE LIQUID GOLD This location gets +1 for each character here.", () => {
//     It("should have base willpower of 7 with no characters at the location", () => {
//       Const testStore = new TestStore(
//         { play: [whiteAgonyPlainsGoldenLagoon] },
//         {},
//       );
//
//       Const location = testStore.getByZoneAndId(
//         "play",
//         WhiteAgonyPlainsGoldenLagoon.id,
//       );
//       Expect(location.willpower).toBe(7);
//     });
//
//     It("should have willpower of 8 with 1 character at the location", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [whiteAgonyPlainsGoldenLagoon, akelaForestRunner],
//         },
//         {},
//       );
//
//       // Move character to the location
//       Const character = testStore.getByZoneAndId("play", akelaForestRunner.id);
//       Const location = testStore.getByZoneAndId(
//         "play",
//         WhiteAgonyPlainsGoldenLagoon.id,
//       );
//
//       Character.enterLocation(location);
//
//       // Base willpower (7) + 1 character = 8
//       Expect(location.willpower).toBe(8);
//     });
//
//     It("should have willpower of 9 with 2 characters at the location", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [
//             WhiteAgonyPlainsGoldenLagoon,
//             AkelaForestRunner,
//             AkelaForestRunner,
//           ],
//         },
//         {},
//       );
//
//       Const characters = testStore.store.cardStore.getAllCards.filter(
//         (card) => card.lorcanitoCard?.id === akelaForestRunner.id,
//       );
//       Const location = testStore.getByZoneAndId(
//         "play",
//         WhiteAgonyPlainsGoldenLagoon.id,
//       );
//
//       // Move both characters to the location
//       Characters.forEach((character) => {
//         Character.enterLocation(location);
//       });
//
//       // Base willpower (7) + 2 characters = 9
//       Expect(location.willpower).toBe(9);
//     });
//   });
// });
//
