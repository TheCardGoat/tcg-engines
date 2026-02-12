// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { webbyVanderquackKnowledgeSeeker } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Webby Vanderquack - Knowledge Seeker", () => {
//   It("I'VE READ ABOUT THIS - Character should have correct base stats", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: webbyVanderquackKnowledgeSeeker.cost,
//       Hand: [webbyVanderquackKnowledgeSeeker],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       WebbyVanderquackKnowledgeSeeker.id,
//     );
//
//     // Check base stats
//     Expect(cardUnderTest.cost).toBe(3);
//     Expect(cardUnderTest.strength).toBe(1);
//     Expect(cardUnderTest.willpower).toBe(6);
//     Expect(cardUnderTest.lore).toBe(1);
//   });
//
//   It("I'VE READ ABOUT THIS - Gets no bonus when there are no characters or locations with cards under them", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: webbyVanderquackKnowledgeSeeker.cost,
//       Play: [webbyVanderquackKnowledgeSeeker, mickeyBraveLittleTailor],
//       Hand: [webbyVanderquackKnowledgeSeeker],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       WebbyVanderquackKnowledgeSeeker.id,
//     );
//
//     // Play Webby
//     Await testEngine.playCard(cardUnderTest);
//
//     // No cards under any characters or locations - should have base lore
//     Const webbyInPlay = testEngine.getByZoneAndId(
//       "play",
//       WebbyVanderquackKnowledgeSeeker.id,
//     );
//     Expect(webbyInPlay.lore).toBe(webbyVanderquackKnowledgeSeeker.lore);
//   });
//
//   It("I'VE READ ABOUT THIS - Ability should be present and functional", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: webbyVanderquackKnowledgeSeeker.cost,
//       Hand: [webbyVanderquackKnowledgeSeeker],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       WebbyVanderquackKnowledgeSeeker.id,
//     );
//
//     // Check that the ability is present
//     Expect(webbyVanderquackKnowledgeSeeker.abilities).toBeDefined();
//     Expect(webbyVanderquackKnowledgeSeeker.abilities?.length).toBeGreaterThan(
//       0,
//     );
//     Expect(webbyVanderquackKnowledgeSeeker.abilities?.[0]?.name).toBe(
//       "I'VE READ ABOUT THIS",
//     );
//
//     // Check that the character is playable
//     Await testEngine.playCard(cardUnderTest);
//     Const webbyInPlay = testEngine.getByZoneAndId(
//       "play",
//       WebbyVanderquackKnowledgeSeeker.id,
//     );
//     Expect(webbyInPlay.zone).toBe("play");
//   });
// });
//
