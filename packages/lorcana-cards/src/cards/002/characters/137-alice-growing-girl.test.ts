// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MerlinSelfAppointmentMentor,
//   Philoctetes,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   AliceGrowingGirl,
//   BasilOfBakerStreet,
//   DocLeaderOfTheSevenDwarfs,
//   DopeyAlwaysPlayful,
//   GrumpyBadTempered,
//   HappyGoodNatured,
//   MulanFreeSpirit,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Alice - Growing Girl", () => {
//   It("**GOOD ADVICE** Your other characters gain **Support**.", () => {
//     Const testStore = new TestStore({
//       Play: [
//         AliceGrowingGirl,
//         DocLeaderOfTheSevenDwarfs,
//         DopeyAlwaysPlayful,
//         GrumpyBadTempered,
//         HappyGoodNatured,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", aliceGrowingGirl.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       DocLeaderOfTheSevenDwarfs.id,
//     );
//     Const target2 = testStore.getByZoneAndId("play", dopeyAlwaysPlayful.id);
//     Const target3 = testStore.getByZoneAndId("play", grumpyBadTempered.id);
//     Const target4 = testStore.getByZoneAndId("play", happyGoodNatured.id);
//
//     Expect(cardUnderTest.hasSupport).toBe(false);
//     [target, target2, target3, target4].forEach((char) => {
//       Expect(char.hasSupport).toBe(true);
//     });
//   });
//
//   It("**WHAT DID I DO?** While this character has 10 {S} or more, she gets +4 {L}.", () => {
//     Const testStore = new TestStore({
//       Play: [
//         AliceGrowingGirl,
//         MulanFreeSpirit,
//         BasilOfBakerStreet,
//         MerlinSelfAppointmentMentor,
//         Philoctetes,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", aliceGrowingGirl.id);
//     Const target = testStore.getByZoneAndId("play", mulanFreeSpirit.id);
//     Const target2 = testStore.getByZoneAndId("play", basilOfBakerStreet.id);
//     Const target3 = testStore.getByZoneAndId(
//       "play",
//       MerlinSelfAppointmentMentor.id,
//     );
//     Const target4 = testStore.getByZoneAndId("play", philoctetes.id);
//
//     Expect(cardUnderTest.strength).toBe(1);
//     Expect(cardUnderTest.lore).toBe(1);
//
//     [target, target2, target3, target4].forEach((char) => {
//       Expect(char.hasSupport).toBe(true);
//       Char.quest();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [cardUnderTest] });
//     });
//
//     Expect(cardUnderTest.strength).toBeGreaterThan(10);
//     Expect(cardUnderTest.lore).toBe(5);
//   });
// });
//
