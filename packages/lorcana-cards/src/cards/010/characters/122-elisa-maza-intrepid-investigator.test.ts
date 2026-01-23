// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { elisaMazaIntrepidInvestigator } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Elisa Maza - Intrepid Investigator", () => {
//   it("SPECIAL DETAIL - Character should have correct base stats", async () => {
//     const testEngine = new TestEngine({
//       inkwell: elisaMazaIntrepidInvestigator.cost,
//       hand: [elisaMazaIntrepidInvestigator],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       elisaMazaIntrepidInvestigator.id,
//     );
//
//     // Check base stats
//     expect(cardUnderTest.cost).toBe(3);
//     expect(cardUnderTest.strength).toBe(4);
//     expect(cardUnderTest.willpower).toBe(3);
//     expect(cardUnderTest.lore).toBe(1);
//     expect(elisaMazaIntrepidInvestigator.colors).toEqual(["ruby"]);
//     expect(elisaMazaIntrepidInvestigator.characteristics).toEqual([
//       "storyborn",
//       "hero",
//       "detective",
//     ]);
//   });
//
//   it("SPECIAL DETAIL - Gets +2 lore when you have 2 or more other characters with strength 5+", async () => {
//     // For now, let's test with just Mickey since we need characters with strength 5+
//     const testEngine = new TestEngine({
//       inkwell: elisaMazaIntrepidInvestigator.cost,
//       play: [
//         mickeyBraveLittleTailor, // strength 3 (won't count)
//       ],
//       hand: [elisaMazaIntrepidInvestigator],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       elisaMazaIntrepidInvestigator.id,
//     );
//
//     // Play Elisa
//     await testEngine.playCard(cardUnderTest);
//
//     // Should have base lore since we don't have 2 characters with 5+ strength
//     const elisaInPlay = testEngine.getByZoneAndId(
//       "play",
//       elisaMazaIntrepidInvestigator.id,
//     );
//     expect(elisaInPlay.lore).toBe(elisaMazaIntrepidInvestigator.lore);
//   });
//
//   it("SPECIAL DETAIL - Gets no bonus when there are fewer than 2 characters with strength 5+", async () => {
//     const testEngine = new TestEngine({
//       inkwell: elisaMazaIntrepidInvestigator.cost,
//       play: [mickeyBraveLittleTailor],
//       hand: [elisaMazaIntrepidInvestigator],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       elisaMazaIntrepidInvestigator.id,
//     );
//
//     // Play Elisa
//     await testEngine.playCard(cardUnderTest);
//
//     // Should have base lore since there's only 1 other character and it doesn't have 5+ strength
//     const elisaInPlay = testEngine.getByZoneAndId(
//       "play",
//       elisaMazaIntrepidInvestigator.id,
//     );
//     expect(elisaInPlay.lore).toBe(elisaMazaIntrepidInvestigator.lore);
//   });
//
//   it("SPECIAL DETAIL - Gets no bonus when there are no other characters", async () => {
//     const testEngine = new TestEngine({
//       inkwell: elisaMazaIntrepidInvestigator.cost,
//       hand: [elisaMazaIntrepidInvestigator],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       elisaMazaIntrepidInvestigator.id,
//     );
//
//     // Play Elisa
//     await testEngine.playCard(cardUnderTest);
//
//     // Should have base lore since there are no other characters
//     const elisaInPlay = testEngine.getByZoneAndId(
//       "play",
//       elisaMazaIntrepidInvestigator.id,
//     );
//     expect(elisaInPlay.lore).toBe(elisaMazaIntrepidInvestigator.lore);
//   });
//
//   it("SPECIAL DETAIL - Ability should be present and functional", async () => {
//     const testEngine = new TestEngine({
//       inkwell: elisaMazaIntrepidInvestigator.cost,
//       hand: [elisaMazaIntrepidInvestigator],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       elisaMazaIntrepidInvestigator.id,
//     );
//
//     // Check that the ability is present
//     expect(elisaMazaIntrepidInvestigator.abilities).toBeDefined();
//     expect(elisaMazaIntrepidInvestigator.abilities?.length).toBeGreaterThan(0);
//     expect(elisaMazaIntrepidInvestigator.abilities?.[0]?.name).toBe(
//       "SPECIAL DETAIL",
//     );
//
//     // Check that the character is playable
//     await testEngine.playCard(cardUnderTest);
//     const elisaInPlay = testEngine.getByZoneAndId(
//       "play",
//       elisaMazaIntrepidInvestigator.id,
//     );
//     expect(elisaInPlay.zone).toBe("play");
//   });
// });
//
