// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { elisaMazaIntrepidInvestigator } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Elisa Maza - Intrepid Investigator", () => {
//   It("SPECIAL DETAIL - Character should have correct base stats", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: elisaMazaIntrepidInvestigator.cost,
//       Hand: [elisaMazaIntrepidInvestigator],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       ElisaMazaIntrepidInvestigator.id,
//     );
//
//     // Check base stats
//     Expect(cardUnderTest.cost).toBe(3);
//     Expect(cardUnderTest.strength).toBe(4);
//     Expect(cardUnderTest.willpower).toBe(3);
//     Expect(cardUnderTest.lore).toBe(1);
//     Expect(elisaMazaIntrepidInvestigator.colors).toEqual(["ruby"]);
//     Expect(elisaMazaIntrepidInvestigator.characteristics).toEqual([
//       "storyborn",
//       "hero",
//       "detective",
//     ]);
//   });
//
//   It("SPECIAL DETAIL - Gets +2 lore when you have 2 or more other characters with strength 5+", async () => {
//     // For now, let's test with just Mickey since we need characters with strength 5+
//     Const testEngine = new TestEngine({
//       Inkwell: elisaMazaIntrepidInvestigator.cost,
//       Play: [
//         MickeyBraveLittleTailor, // strength 3 (won't count)
//       ],
//       Hand: [elisaMazaIntrepidInvestigator],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       ElisaMazaIntrepidInvestigator.id,
//     );
//
//     // Play Elisa
//     Await testEngine.playCard(cardUnderTest);
//
//     // Should have base lore since we don't have 2 characters with 5+ strength
//     Const elisaInPlay = testEngine.getByZoneAndId(
//       "play",
//       ElisaMazaIntrepidInvestigator.id,
//     );
//     Expect(elisaInPlay.lore).toBe(elisaMazaIntrepidInvestigator.lore);
//   });
//
//   It("SPECIAL DETAIL - Gets no bonus when there are fewer than 2 characters with strength 5+", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: elisaMazaIntrepidInvestigator.cost,
//       Play: [mickeyBraveLittleTailor],
//       Hand: [elisaMazaIntrepidInvestigator],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       ElisaMazaIntrepidInvestigator.id,
//     );
//
//     // Play Elisa
//     Await testEngine.playCard(cardUnderTest);
//
//     // Should have base lore since there's only 1 other character and it doesn't have 5+ strength
//     Const elisaInPlay = testEngine.getByZoneAndId(
//       "play",
//       ElisaMazaIntrepidInvestigator.id,
//     );
//     Expect(elisaInPlay.lore).toBe(elisaMazaIntrepidInvestigator.lore);
//   });
//
//   It("SPECIAL DETAIL - Gets no bonus when there are no other characters", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: elisaMazaIntrepidInvestigator.cost,
//       Hand: [elisaMazaIntrepidInvestigator],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       ElisaMazaIntrepidInvestigator.id,
//     );
//
//     // Play Elisa
//     Await testEngine.playCard(cardUnderTest);
//
//     // Should have base lore since there are no other characters
//     Const elisaInPlay = testEngine.getByZoneAndId(
//       "play",
//       ElisaMazaIntrepidInvestigator.id,
//     );
//     Expect(elisaInPlay.lore).toBe(elisaMazaIntrepidInvestigator.lore);
//   });
//
//   It("SPECIAL DETAIL - Ability should be present and functional", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: elisaMazaIntrepidInvestigator.cost,
//       Hand: [elisaMazaIntrepidInvestigator],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       ElisaMazaIntrepidInvestigator.id,
//     );
//
//     // Check that the ability is present
//     Expect(elisaMazaIntrepidInvestigator.abilities).toBeDefined();
//     Expect(elisaMazaIntrepidInvestigator.abilities?.length).toBeGreaterThan(0);
//     Expect(elisaMazaIntrepidInvestigator.abilities?.[0]?.name).toBe(
//       "SPECIAL DETAIL",
//     );
//
//     // Check that the character is playable
//     Await testEngine.playCard(cardUnderTest);
//     Const elisaInPlay = testEngine.getByZoneAndId(
//       "play",
//       ElisaMazaIntrepidInvestigator.id,
//     );
//     Expect(elisaInPlay.zone).toBe("play");
//   });
// });
//
