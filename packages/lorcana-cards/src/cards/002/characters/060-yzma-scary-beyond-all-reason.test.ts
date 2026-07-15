// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mauiDemiGod } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   GoofyKnightForADay,
//   YzmaScaryBeyondAllReason,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// // Flaky test, skipping for now
// Describe.skip("Yzma - Scary Beyond All Reason", () => {
//   Describe.skip("**CRUEL IRONY** When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.", () => {
//     It("Targeting opponent's card", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: yzmaScaryBeyondAllReason.cost,
//           Hand: [yzmaScaryBeyondAllReason],
//           Play: [goofyKnightForADay],
//         },
//         {
//           Play: [mauiDemiGod],
//           Deck: 60,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         YzmaScaryBeyondAllReason.id,
//       );
//
//       Const target = testStore.getByZoneAndId(
//         "play",
//         MauiDemiGod.id,
//         "player_two",
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("deck");
//       Expect(testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({
//           Deck: 60 - 2 + 1, // Maui is shuffled back into the deck
//           Hand: 2,
//           Play: 0,
//         }),
//       );
//     });
//
//     It("Targeting your own card", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: yzmaScaryBeyondAllReason.cost,
//           Hand: [yzmaScaryBeyondAllReason],
//           Play: [goofyKnightForADay],
//           Deck: 60,
//         },
//         {
//           Play: [mauiDemiGod],
//           Deck: 3,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         YzmaScaryBeyondAllReason.id,
//       );
//       Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("deck");
//       Expect(testStore.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({
//           Deck: 60 - 2 + 1, // goofyKnightForADay is shuffled back into the deck
//           Hand: 2,
//         }),
//       );
//       Expect(testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({
//           Deck: 3,
//           Hand: 0,
//           Play: 1,
//         }),
//       );
//     });
//   });
//
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Play: [yzmaScaryBeyondAllReason],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       YzmaScaryBeyondAllReason.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
// Describe("Regression", () => {
//   It("When no target is available, it should igore layer", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [yzmaScaryBeyondAllReason],
//       Inkwell: yzmaScaryBeyondAllReason.cost,
//     });
//
//     Await testEngine.playCard(yzmaScaryBeyondAllReason);
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
