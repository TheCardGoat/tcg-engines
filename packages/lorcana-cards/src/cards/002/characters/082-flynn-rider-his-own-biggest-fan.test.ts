// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { flynnRiderHisOwnBiggestFan } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Flynn Rider - His Own Biggest Fan", () => {
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Play: [flynnRiderHisOwnBiggestFan],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       FlynnRiderHisOwnBiggestFan.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toEqual(true);
//   });
//
//   It("Evasive", () => {
//     Const testStore = new TestStore({
//       Play: [flynnRiderHisOwnBiggestFan],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       FlynnRiderHisOwnBiggestFan.id,
//     );
//
//     Expect(cardUnderTest.hasEvasive).toEqual(true);
//   });
//
//   Describe("**ONE LAST, BIG SCORE** This character gets -1 {L} for each card in your opponents' hands.", () => {
//     It("Zero cards in opponent's hand", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [flynnRiderHisOwnBiggestFan],
//         },
//         {
//           Hand: [],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         FlynnRiderHisOwnBiggestFan.id,
//       );
//
//       Expect(cardUnderTest.lore).toEqual(4);
//     });
//
//     It("One card in opponent's hand", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [flynnRiderHisOwnBiggestFan],
//         },
//         {
//           Hand: 1,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         FlynnRiderHisOwnBiggestFan.id,
//       );
//
//       Expect(cardUnderTest.lore).toEqual(3);
//     });
//
//     It("Two cards in opponent's hand", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [flynnRiderHisOwnBiggestFan],
//         },
//         {
//           Hand: 2,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         FlynnRiderHisOwnBiggestFan.id,
//       );
//
//       Expect(cardUnderTest.lore).toEqual(2);
//     });
//
//     It("Four cards in opponent's hand", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [flynnRiderHisOwnBiggestFan],
//         },
//         {
//           Hand: 4,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         FlynnRiderHisOwnBiggestFan.id,
//       );
//
//       Expect(cardUnderTest.lore).toEqual(0);
//     });
//   });
// });
//
