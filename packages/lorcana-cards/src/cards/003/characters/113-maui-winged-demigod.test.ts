// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HeiheiAccidentalExplorer,
//   MauiWingedDemigod,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { heiheiBumblingRooster } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { stitchTeamUnderdog } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maui - Winged Demigod", () => {
//   It("**Reckless** _(They can’t quest and must challenge if able.)_", () => {
//     Const testStore = new TestStore({
//       Play: [mauiWingedDemigod],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MauiWingedDemigod.id,
//     );
//     Expect(cardUnderTest.hasReckless).toBe(true);
//   });
//
//   It("**IN MY STOMACH** Whenever one of your characters named Heihei quests, this character gets +1 {L} and loses **Reckless** for this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [
//         MauiWingedDemigod,
//         HeiheiBumblingRooster,
//         HeiheiAccidentalExplorer,
//         StitchTeamUnderdog,
//       ],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mauiWingedDemigod);
//
//     Await testEngine.questCard(stitchTeamUnderdog);
//     Expect(cardUnderTest.lore).toBe(mauiWingedDemigod.lore);
//     Expect(cardUnderTest.hasReckless).toBe(true);
//
//     Await testEngine.questCard(heiheiBumblingRooster);
//     Expect(cardUnderTest.lore).toBe(mauiWingedDemigod.lore + 1);
//     // expect(cardUnderTest.hasReckless).toBe(false);
//
//     Await testEngine.questCard(heiheiAccidentalExplorer);
//     Expect(cardUnderTest.lore).toBe(mauiWingedDemigod.lore + 2);
//     // expect(cardUnderTest.hasReckless).toBe(false);
//   });
// });
//
