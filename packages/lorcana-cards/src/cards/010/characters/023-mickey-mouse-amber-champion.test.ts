// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GazelleBalladSinger,
//   MickeyMouseAmberChampion,
//   ShantiVillageGirl,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { chefLouisInOverHisHead } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mickey Mouse - Amber Champion", () => {
//   Describe("LEADING THE WAY", () => {
//     It("should give other Amber characters +2 willpower", async () => {
//       Const testEngine = new TestEngine({
//         Play: [mickeyMouseAmberChampion, shantiVillageGirl],
//       });
//
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//       Const shanti = testEngine.getCardModel(shantiVillageGirl);
//
//       // Shanti should get +2 willpower from Mickey's ability
//       Expect(shanti.willpower).toBe(shantiVillageGirl.willpower + 2);
//
//       // Mickey should not buff himself
//       Expect(mickey.willpower).toBe(mickeyMouseAmberChampion.willpower);
//     });
//
//     It("should not give willpower bonus to non-Amber characters", async () => {
//       Const testEngine = new TestEngine({
//         Play: [mickeyMouseAmberChampion, chefLouisInOverHisHead],
//       });
//
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//       Const chefLouis = testEngine.getCardModel(chefLouisInOverHisHead);
//
//       // Chef Louis is Ruby, so should not get the bonus
//       Expect(chefLouis.willpower).toBe(chefLouisInOverHisHead.willpower);
//
//       // Mickey should not buff himself
//       Expect(mickey.willpower).toBe(mickeyMouseAmberChampion.willpower);
//     });
//
//     It("should buff multiple Amber characters", async () => {
//       Const testEngine = new TestEngine({
//         Play: [
//           MickeyMouseAmberChampion,
//           ShantiVillageGirl,
//           GazelleBalladSinger,
//         ],
//       });
//
//       Const shanti = testEngine.getCardModel(shantiVillageGirl);
//       Const gazelle = testEngine.getCardModel(gazelleBalladSinger);
//
//       // Both Amber characters should get +2 willpower
//       Expect(shanti.willpower).toBe(shantiVillageGirl.willpower + 2);
//       Expect(gazelle.willpower).toBe(gazelleBalladSinger.willpower + 2);
//     });
//   });
//
//   Describe("FRIENDLY CHORUS", () => {
//     It("should not have Singer 8 when alone", async () => {
//       Const testEngine = new TestEngine({
//         Play: [mickeyMouseAmberChampion],
//       });
//
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey should not have Singer when alone
//       Expect(mickey.hasSinger).toBe(false);
//     });
//
//     It("should not have Singer 8 with only 1 other Amber character", async () => {
//       Const testEngine = new TestEngine({
//         Play: [mickeyMouseAmberChampion, shantiVillageGirl],
//       });
//
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey should not have Singer with only 1 other Amber character
//       Expect(mickey.hasSinger).toBe(false);
//     });
//
//     It("should gain Singer 8 when you have 2 or more other Amber characters in play", async () => {
//       Const testEngine = new TestEngine({
//         Play: [
//           MickeyMouseAmberChampion,
//           ShantiVillageGirl,
//           GazelleBalladSinger,
//         ],
//       });
//
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey should have Singer 8 with 2 other Amber characters
//       Expect(mickey.hasSinger).toBe(true);
//       Expect(mickey.singerCost).toBe(8);
//     });
//
//     It("should not count non-Amber characters towards the condition", async () => {
//       Const testEngine = new TestEngine({
//         Play: [
//           MickeyMouseAmberChampion,
//           ShantiVillageGirl,
//           ChefLouisInOverHisHead,
//         ],
//       });
//
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey should not have Singer because Chef Louis is not Amber
//       // (only 1 other Amber character: Shanti)
//       Expect(mickey.hasSinger).toBe(false);
//     });
//   });
//
//   Describe("Both abilities together", () => {
//     It("should work correctly when both abilities are active", async () => {
//       Const testEngine = new TestEngine({
//         Play: [
//           MickeyMouseAmberChampion,
//           ShantiVillageGirl,
//           GazelleBalladSinger,
//         ],
//       });
//
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//       Const shanti = testEngine.getCardModel(shantiVillageGirl);
//       Const gazelle = testEngine.getCardModel(gazelleBalladSinger);
//
//       // LEADING THE WAY: Both other Amber characters get +2 willpower
//       Expect(shanti.willpower).toBe(shantiVillageGirl.willpower + 2);
//       Expect(gazelle.willpower).toBe(gazelleBalladSinger.willpower + 2);
//
//       // FRIENDLY CHORUS: Mickey gains Singer 8 with 2+ other Amber characters
//       Expect(mickey.hasSinger).toBe(true);
//       Expect(mickey.singerCost).toBe(8);
//
//       // Mickey doesn't buff himself
//       Expect(mickey.willpower).toBe(mickeyMouseAmberChampion.willpower);
//     });
//   });
// });
//
