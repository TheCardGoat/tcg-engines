// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   crikeePartOfTheTeam,
//   marchHareHareBrainedEccentric,
//   palaceGuardSpectralSentry,
//   theColonelOldSheepdog,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Cri-kee - Part of the Team", () => {
//   it("AT HER SIDE While you have 2 or more other exerted characters in play, this character gets +2 {L}.", async () => {
//     const testEngine = new TestEngine({
//       play: [
//         crikeePartOfTheTeam,
//         marchHareHareBrainedEccentric,
//         theColonelOldSheepdog,
//         palaceGuardSpectralSentry,
//       ],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(crikeePartOfTheTeam);
//
//     // Check that Cri-kee doesn't have +2 Lore
//     expect(cardUnderTest.lore).toBe(1);
//
//     await testEngine.tapCard(marchHareHareBrainedEccentric);
//
//     // Check that Cri-kee doesn't have +2 Lore
//     expect(cardUnderTest.lore).toBe(1);
//
//     await testEngine.tapCard(theColonelOldSheepdog);
//
//     // Check that Cri-kee has +2 Lore
//     expect(cardUnderTest.lore).toBe(3);
//
//     await testEngine.tapCard(palaceGuardSpectralSentry);
//
//     // Check that Cri-kee has +2 Lore
//     expect(cardUnderTest.lore).toBe(3);
//
//     // Ready palace guard
//     await testEngine.tapCard(palaceGuardSpectralSentry, true);
//
//     // Check that Cri-kee has +2 Lore
//     expect(cardUnderTest.lore).toBe(3);
//
//     // Ready the Colonel
//     await testEngine.tapCard(theColonelOldSheepdog, true);
//
//     // Check that Cri-kee doesn't have +2 Lore
//     expect(cardUnderTest.lore).toBe(1);
//
//     // Ready the Hare
//     await testEngine.tapCard(marchHareHareBrainedEccentric, true);
//
//     // Check that Cri-kee doesn't have +2 Lore
//     expect(cardUnderTest.lore).toBe(1);
//   });
// });
//
