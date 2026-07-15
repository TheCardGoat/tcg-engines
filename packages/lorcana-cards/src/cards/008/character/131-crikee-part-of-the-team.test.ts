// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CrikeePartOfTheTeam,
//   MarchHareHareBrainedEccentric,
//   PalaceGuardSpectralSentry,
//   TheColonelOldSheepdog,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Cri-kee - Part of the Team", () => {
//   It("AT HER SIDE While you have 2 or more other exerted characters in play, this character gets +2 {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [
//         CrikeePartOfTheTeam,
//         MarchHareHareBrainedEccentric,
//         TheColonelOldSheepdog,
//         PalaceGuardSpectralSentry,
//       ],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(crikeePartOfTheTeam);
//
//     // Check that Cri-kee doesn't have +2 Lore
//     Expect(cardUnderTest.lore).toBe(1);
//
//     Await testEngine.tapCard(marchHareHareBrainedEccentric);
//
//     // Check that Cri-kee doesn't have +2 Lore
//     Expect(cardUnderTest.lore).toBe(1);
//
//     Await testEngine.tapCard(theColonelOldSheepdog);
//
//     // Check that Cri-kee has +2 Lore
//     Expect(cardUnderTest.lore).toBe(3);
//
//     Await testEngine.tapCard(palaceGuardSpectralSentry);
//
//     // Check that Cri-kee has +2 Lore
//     Expect(cardUnderTest.lore).toBe(3);
//
//     // Ready palace guard
//     Await testEngine.tapCard(palaceGuardSpectralSentry, true);
//
//     // Check that Cri-kee has +2 Lore
//     Expect(cardUnderTest.lore).toBe(3);
//
//     // Ready the Colonel
//     Await testEngine.tapCard(theColonelOldSheepdog, true);
//
//     // Check that Cri-kee doesn't have +2 Lore
//     Expect(cardUnderTest.lore).toBe(1);
//
//     // Ready the Hare
//     Await testEngine.tapCard(marchHareHareBrainedEccentric, true);
//
//     // Check that Cri-kee doesn't have +2 Lore
//     Expect(cardUnderTest.lore).toBe(1);
//   });
// });
//
