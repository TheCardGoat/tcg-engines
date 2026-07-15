// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BashfulHopelessRomantic,
//   DocLeaderOfTheSevenDwarfs,
//   GrumpyBadTempered,
//   SleepyNoddingOff,
//   SnowWhiteUnexpectedHouseGuest,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Snow White - Unexpected Househuest", () => {
//   It("**HOW DO YOU DO?** You pay 1 {I} less to play Seven Dwarfs characters.", () => {
//     Const testStore = new TestStore({
//       Inkwell:
//         GrumpyBadTempered.cost +
//         DocLeaderOfTheSevenDwarfs.cost +
//         SleepyNoddingOff.cost +
//         BashfulHopelessRomantic.cost -
//         4,
//       Hand: [
//         GrumpyBadTempered,
//         DocLeaderOfTheSevenDwarfs,
//         SleepyNoddingOff,
//         BashfulHopelessRomantic,
//       ],
//       Play: [snowWhiteUnexpectedHouseGuest],
//     });
//
//     Const target0 = testStore.getByZoneAndId("hand", grumpyBadTempered.id);
//     Const target1 = testStore.getByZoneAndId(
//       "hand",
//       DocLeaderOfTheSevenDwarfs.id,
//     );
//     Const target2 = testStore.getByZoneAndId("hand", sleepyNoddingOff.id);
//     Const target3 = testStore.getByZoneAndId(
//       "hand",
//       BashfulHopelessRomantic.id,
//     );
//
//     [target0, target1, target2, target3].forEach((card) => {
//       Expect(card.zone).toEqual("hand");
//       Card.playFromHand();
//       Expect(card.zone).toEqual("play");
//     });
//   });
// });
//
