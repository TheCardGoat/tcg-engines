// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mickeyMouseDetective,
//   webbyVanderquackMysteryEnthusiast,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Webby Vanderquack - Mystery Enthusiast", () => {
//   it("CONTAGIOUS ENERGY - Character should have correct base stats", async () => {
//     const testEngine = new TestEngine({
//       hand: [webbyVanderquackMysteryEnthusiast],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       webbyVanderquackMysteryEnthusiast.id,
//     );
//
//     // Check base stats
//     expect(cardUnderTest.cost).toBe(1);
//     expect(cardUnderTest.strength).toBe(1);
//     expect(cardUnderTest.willpower).toBe(2);
//     expect(cardUnderTest.lore).toBe(1);
//     expect(cardUnderTest.characteristics).toEqual(["storyborn", "ally"]);
//   });
//
//   it("CONTAGIOUS ENERGY - Character can be played with correct cost", async () => {
//     const testEngine = new TestEngine({
//       inkwell: webbyVanderquackMysteryEnthusiast.cost,
//       hand: [webbyVanderquackMysteryEnthusiast],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       webbyVanderquackMysteryEnthusiast.id,
//     );
//
//     await testEngine.playCard(cardUnderTest);
//     const webbyInPlay = testEngine.getByZoneAndId(
//       "play",
//       webbyVanderquackMysteryEnthusiast.id,
//     );
//     expect(webbyInPlay.zone).toBe("play");
//   });
//
//   it("CONTAGIOUS ENERGY - When you play this character, chosen character gets +1 {S} this turn", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: webbyVanderquackMysteryEnthusiast.cost,
//         hand: [webbyVanderquackMysteryEnthusiast],
//       },
//       {
//         play: [mickeyMouseDetective],
//       },
//     );
//
//     const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//     // Verify Mickey's base strength
//     expect(mickey.strength).toBe(mickeyMouseDetective.strength);
//
//     // Play Webby
//     await testEngine.playCard(webbyVanderquackMysteryEnthusiast);
//
//     // Target Mickey for the +1 strength bonus
//     await testEngine.resolveTopOfStack({ targets: [mickey] });
//
//     // Mickey should have +1 strength this turn
//     expect(mickey.strength).toBe(mickeyMouseDetective.strength + 1);
//
//     // Pass turn and verify the bonus expires
//     testEngine.passTurn();
//     expect(mickey.strength).toBe(mickeyMouseDetective.strength);
//   });
//
//   it("CONTAGIOUS ENERGY - Can target herself for the +1 {S} bonus", async () => {
//     const testEngine = new TestEngine({
//       inkwell: webbyVanderquackMysteryEnthusiast.cost,
//       hand: [webbyVanderquackMysteryEnthusiast],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(
//       webbyVanderquackMysteryEnthusiast,
//     );
//
//     // Play Webby
//     await testEngine.playCard(webbyVanderquackMysteryEnthusiast);
//
//     // Target herself for the +1 strength bonus
//     await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });
//
//     // Webby should have +1 strength this turn
//     expect(cardUnderTest.strength).toBe(
//       webbyVanderquackMysteryEnthusiast.strength + 1,
//     );
//
//     // Pass turn and verify the bonus expires
//     testEngine.passTurn();
//     expect(cardUnderTest.strength).toBe(
//       webbyVanderquackMysteryEnthusiast.strength,
//     );
//   });
//
//   it("CONTAGIOUS ENERGY - Ability should be present and functional", async () => {
//     const testEngine = new TestEngine({
//       inkwell: webbyVanderquackMysteryEnthusiast.cost,
//       hand: [webbyVanderquackMysteryEnthusiast],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       webbyVanderquackMysteryEnthusiast.id,
//     );
//
//     // Check that the ability is present
//     expect(webbyVanderquackMysteryEnthusiast.abilities).toBeDefined();
//     expect(webbyVanderquackMysteryEnthusiast.abilities?.length).toBeGreaterThan(
//       0,
//     );
//     expect(webbyVanderquackMysteryEnthusiast.abilities?.[0]?.name).toBe(
//       "CONTAGIOUS ENERGY",
//     );
//
//     // Check that the character is playable
//     await testEngine.playCard(cardUnderTest);
//     const webbyInPlay = testEngine.getByZoneAndId(
//       "play",
//       webbyVanderquackMysteryEnthusiast.id,
//     );
//     expect(webbyInPlay.zone).toBe("play");
//   });
// });
//
