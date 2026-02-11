// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { stichtNewDog } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { atlanticaConcertHall } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Atlantica - Concert Hall", () => {
//   It("Underwater Acoustics - Characters count as having +2 cost to sing songs while here.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: atlanticaConcertHall.moveCost,
//       Play: [atlanticaConcertHall, stichtNewDog],
//     });
//
//     Const { location, character } = await testEngine.moveToLocation({
//       Character: stichtNewDog,
//       Location: atlanticaConcertHall,
//     });
//
//     Expect(character.singerCost).toBe(2 + stichtNewDog.cost);
//   });
// });
//
