// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KakamoraBoardingParty,
//   SisuInHerElement,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { treasureMountainAzuriteSeaIsland } from "@lorcanito/lorcana-engine/cards/006/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Treasure Mountain - Azurite Sea Island", () => {
//   It("SECRET WEAPON At the start of your turn, deal damage to chosen character or location equal to the number of characters here.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: treasureMountainAzuriteSeaIsland.moveCost * 2,
//         Play: [
//           TreasureMountainAzuriteSeaIsland,
//           SisuInHerElement,
//           KakamoraBoardingParty,
//         ],
//         Deck: 2,
//       },
//       {
//         Deck: 2,
//       },
//     );
//
//     For (const card of [sisuInHerElement, kakamoraBoardingParty]) {
//       Await testEngine.moveToLocation({
//         Location: treasureMountainAzuriteSeaIsland,
//         Character: card,
//       });
//     }
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Await testEngine.resolveTopOfStack({
//       Targets: [treasureMountainAzuriteSeaIsland],
//     });
//
//     Expect(
//       TestEngine.getCardModel(treasureMountainAzuriteSeaIsland).damage,
//     ).toEqual(2);
//   });
// });
//
