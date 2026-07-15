// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { madHattersTeapot } from "@lorcanito/lorcana-engine/cards/006/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mad Hatter's Teapot", () => {
//   It("**NO ROOM, NO ROOM**, {E}, 1 {I} – Each opponent puts the top card of their deck into their discard.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 2,
//         Play: [madHattersTeapot],
//         Deck: 2,
//       },
//       {
//         Deck: 2,
//       },
//     );
//
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ deck: 2 }),
//     );
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ deck: 2 }),
//     );
//
//     Await testEngine.activateCard(madHattersTeapot);
//
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ deck: 2 }),
//     );
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ deck: 1 }),
//     );
//   });
// });
//
