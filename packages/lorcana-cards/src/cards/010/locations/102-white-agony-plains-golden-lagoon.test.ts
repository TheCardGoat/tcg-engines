// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { akelaForestRunner } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// import { whiteAgonyPlainsGoldenLagoon } from "@lorcanito/lorcana-engine/cards/010/locations/locations";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe.skip("White Agony Plains - Golden Lagoon", () => {
//   describe.skip("PURE LIQUID GOLD This location gets +1 for each character here.", () => {
//     it("should have base willpower of 7 with no characters at the location", () => {
//       const testStore = new TestStore(
//         { play: [whiteAgonyPlainsGoldenLagoon] },
//         {},
//       );
//
//       const location = testStore.getByZoneAndId(
//         "play",
//         whiteAgonyPlainsGoldenLagoon.id,
//       );
//       expect(location.willpower).toBe(7);
//     });
//
//     it("should have willpower of 8 with 1 character at the location", () => {
//       const testStore = new TestStore(
//         {
//           play: [whiteAgonyPlainsGoldenLagoon, akelaForestRunner],
//         },
//         {},
//       );
//
//       // Move character to the location
//       const character = testStore.getByZoneAndId("play", akelaForestRunner.id);
//       const location = testStore.getByZoneAndId(
//         "play",
//         whiteAgonyPlainsGoldenLagoon.id,
//       );
//
//       character.enterLocation(location);
//
//       // Base willpower (7) + 1 character = 8
//       expect(location.willpower).toBe(8);
//     });
//
//     it("should have willpower of 9 with 2 characters at the location", () => {
//       const testStore = new TestStore(
//         {
//           play: [
//             whiteAgonyPlainsGoldenLagoon,
//             akelaForestRunner,
//             akelaForestRunner,
//           ],
//         },
//         {},
//       );
//
//       const characters = testStore.store.cardStore.getAllCards.filter(
//         (card) => card.lorcanitoCard?.id === akelaForestRunner.id,
//       );
//       const location = testStore.getByZoneAndId(
//         "play",
//         whiteAgonyPlainsGoldenLagoon.id,
//       );
//
//       // Move both characters to the location
//       characters.forEach((character) => {
//         character.enterLocation(location);
//       });
//
//       // Base willpower (7) + 2 characters = 9
//       expect(location.willpower).toBe(9);
//     });
//   });
// });
//
