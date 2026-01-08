// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   gazelleBalladSinger,
//   mickeyMouseAmberChampion,
//   shantiVillageGirl,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { chefLouisInOverHisHead } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mickey Mouse - Amber Champion", () => {
//   describe("LEADING THE WAY", () => {
//     it("should give other Amber characters +2 willpower", async () => {
//       const testEngine = new TestEngine({
//         play: [mickeyMouseAmberChampion, shantiVillageGirl],
//       });
//
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//       const shanti = testEngine.getCardModel(shantiVillageGirl);
//
//       // Shanti should get +2 willpower from Mickey's ability
//       expect(shanti.willpower).toBe(shantiVillageGirl.willpower + 2);
//
//       // Mickey should not buff himself
//       expect(mickey.willpower).toBe(mickeyMouseAmberChampion.willpower);
//     });
//
//     it("should not give willpower bonus to non-Amber characters", async () => {
//       const testEngine = new TestEngine({
//         play: [mickeyMouseAmberChampion, chefLouisInOverHisHead],
//       });
//
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//       const chefLouis = testEngine.getCardModel(chefLouisInOverHisHead);
//
//       // Chef Louis is Ruby, so should not get the bonus
//       expect(chefLouis.willpower).toBe(chefLouisInOverHisHead.willpower);
//
//       // Mickey should not buff himself
//       expect(mickey.willpower).toBe(mickeyMouseAmberChampion.willpower);
//     });
//
//     it("should buff multiple Amber characters", async () => {
//       const testEngine = new TestEngine({
//         play: [
//           mickeyMouseAmberChampion,
//           shantiVillageGirl,
//           gazelleBalladSinger,
//         ],
//       });
//
//       const shanti = testEngine.getCardModel(shantiVillageGirl);
//       const gazelle = testEngine.getCardModel(gazelleBalladSinger);
//
//       // Both Amber characters should get +2 willpower
//       expect(shanti.willpower).toBe(shantiVillageGirl.willpower + 2);
//       expect(gazelle.willpower).toBe(gazelleBalladSinger.willpower + 2);
//     });
//   });
//
//   describe("FRIENDLY CHORUS", () => {
//     it("should not have Singer 8 when alone", async () => {
//       const testEngine = new TestEngine({
//         play: [mickeyMouseAmberChampion],
//       });
//
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey should not have Singer when alone
//       expect(mickey.hasSinger).toBe(false);
//     });
//
//     it("should not have Singer 8 with only 1 other Amber character", async () => {
//       const testEngine = new TestEngine({
//         play: [mickeyMouseAmberChampion, shantiVillageGirl],
//       });
//
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey should not have Singer with only 1 other Amber character
//       expect(mickey.hasSinger).toBe(false);
//     });
//
//     it("should gain Singer 8 when you have 2 or more other Amber characters in play", async () => {
//       const testEngine = new TestEngine({
//         play: [
//           mickeyMouseAmberChampion,
//           shantiVillageGirl,
//           gazelleBalladSinger,
//         ],
//       });
//
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey should have Singer 8 with 2 other Amber characters
//       expect(mickey.hasSinger).toBe(true);
//       expect(mickey.singerCost).toBe(8);
//     });
//
//     it("should not count non-Amber characters towards the condition", async () => {
//       const testEngine = new TestEngine({
//         play: [
//           mickeyMouseAmberChampion,
//           shantiVillageGirl,
//           chefLouisInOverHisHead,
//         ],
//       });
//
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey should not have Singer because Chef Louis is not Amber
//       // (only 1 other Amber character: Shanti)
//       expect(mickey.hasSinger).toBe(false);
//     });
//   });
//
//   describe("Both abilities together", () => {
//     it("should work correctly when both abilities are active", async () => {
//       const testEngine = new TestEngine({
//         play: [
//           mickeyMouseAmberChampion,
//           shantiVillageGirl,
//           gazelleBalladSinger,
//         ],
//       });
//
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//       const shanti = testEngine.getCardModel(shantiVillageGirl);
//       const gazelle = testEngine.getCardModel(gazelleBalladSinger);
//
//       // LEADING THE WAY: Both other Amber characters get +2 willpower
//       expect(shanti.willpower).toBe(shantiVillageGirl.willpower + 2);
//       expect(gazelle.willpower).toBe(gazelleBalladSinger.willpower + 2);
//
//       // FRIENDLY CHORUS: Mickey gains Singer 8 with 2+ other Amber characters
//       expect(mickey.hasSinger).toBe(true);
//       expect(mickey.singerCost).toBe(8);
//
//       // Mickey doesn't buff himself
//       expect(mickey.willpower).toBe(mickeyMouseAmberChampion.willpower);
//     });
//   });
// });
//
