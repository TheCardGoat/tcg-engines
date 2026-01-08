// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { webbyVanderquackKnowledgeSeeker } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Webby Vanderquack - Knowledge Seeker", () => {
//   it("I'VE READ ABOUT THIS - Character should have correct base stats", async () => {
//     const testEngine = new TestEngine({
//       inkwell: webbyVanderquackKnowledgeSeeker.cost,
//       hand: [webbyVanderquackKnowledgeSeeker],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       webbyVanderquackKnowledgeSeeker.id,
//     );
//
//     // Check base stats
//     expect(cardUnderTest.cost).toBe(3);
//     expect(cardUnderTest.strength).toBe(1);
//     expect(cardUnderTest.willpower).toBe(6);
//     expect(cardUnderTest.lore).toBe(1);
//   });
//
//   it("I'VE READ ABOUT THIS - Gets no bonus when there are no characters or locations with cards under them", async () => {
//     const testEngine = new TestEngine({
//       inkwell: webbyVanderquackKnowledgeSeeker.cost,
//       play: [webbyVanderquackKnowledgeSeeker, mickeyBraveLittleTailor],
//       hand: [webbyVanderquackKnowledgeSeeker],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       webbyVanderquackKnowledgeSeeker.id,
//     );
//
//     // Play Webby
//     await testEngine.playCard(cardUnderTest);
//
//     // No cards under any characters or locations - should have base lore
//     const webbyInPlay = testEngine.getByZoneAndId(
//       "play",
//       webbyVanderquackKnowledgeSeeker.id,
//     );
//     expect(webbyInPlay.lore).toBe(webbyVanderquackKnowledgeSeeker.lore);
//   });
//
//   it("I'VE READ ABOUT THIS - Ability should be present and functional", async () => {
//     const testEngine = new TestEngine({
//       inkwell: webbyVanderquackKnowledgeSeeker.cost,
//       hand: [webbyVanderquackKnowledgeSeeker],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       webbyVanderquackKnowledgeSeeker.id,
//     );
//
//     // Check that the ability is present
//     expect(webbyVanderquackKnowledgeSeeker.abilities).toBeDefined();
//     expect(webbyVanderquackKnowledgeSeeker.abilities?.length).toBeGreaterThan(
//       0,
//     );
//     expect(webbyVanderquackKnowledgeSeeker.abilities?.[0]?.name).toBe(
//       "I'VE READ ABOUT THIS",
//     );
//
//     // Check that the character is playable
//     await testEngine.playCard(cardUnderTest);
//     const webbyInPlay = testEngine.getByZoneAndId(
//       "play",
//       webbyVanderquackKnowledgeSeeker.id,
//     );
//     expect(webbyInPlay.zone).toBe("play");
//   });
// });
//
