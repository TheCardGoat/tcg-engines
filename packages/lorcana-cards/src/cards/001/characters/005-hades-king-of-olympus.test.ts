// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HadesKingOfOlympus,
//   MaleficentUninvited,
//   ScarFieryUsurper,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hades - King of Olympus", () => {
//   // TODO: Fix this test
//   It.skip("**Sinister plot** This character gets +1 {L} for every other Villain character you have in play.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: maleficentUninvited.cost + scarFieryUsurper.cost,
//         Hand: [maleficentUninvited, scarFieryUsurper],
//         Play: [hadesKingOfOlympus],
//         Deck: 1,
//       },
//       { deck: 1 },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       HadesKingOfOlympus.id,
//     );
//     Const targetCard = testStore.getByZoneAndId("hand", maleficentUninvited.id);
//     Const anotherCard = testStore.getByZoneAndId("hand", scarFieryUsurper.id);
//
//     Expect(cardUnderTest.strength).toEqual(6);
//
//     TargetCard.playFromHand();
//     Expect(cardUnderTest.strength).toEqual(7);
//
//     AnotherCard.playFromHand();
//     Expect(cardUnderTest.strength).toEqual(8);
//   });
//
//   It("**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Hades._)", () => {
//     Const testStore = new TestStore({
//       Play: [hadesKingOfOlympus],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       HadesKingOfOlympus.id,
//     );
//     Expect(cardUnderTest.hasShift).toEqual(true);
//   });
// });
//
