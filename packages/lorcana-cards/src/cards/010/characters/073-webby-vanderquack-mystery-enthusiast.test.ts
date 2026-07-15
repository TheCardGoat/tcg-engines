// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyMouseDetective,
//   WebbyVanderquackMysteryEnthusiast,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Webby Vanderquack - Mystery Enthusiast", () => {
//   It("CONTAGIOUS ENERGY - Character should have correct base stats", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [webbyVanderquackMysteryEnthusiast],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       WebbyVanderquackMysteryEnthusiast.id,
//     );
//
//     // Check base stats
//     Expect(cardUnderTest.cost).toBe(1);
//     Expect(cardUnderTest.strength).toBe(1);
//     Expect(cardUnderTest.willpower).toBe(2);
//     Expect(cardUnderTest.lore).toBe(1);
//     Expect(cardUnderTest.characteristics).toEqual(["storyborn", "ally"]);
//   });
//
//   It("CONTAGIOUS ENERGY - Character can be played with correct cost", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: webbyVanderquackMysteryEnthusiast.cost,
//       Hand: [webbyVanderquackMysteryEnthusiast],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       WebbyVanderquackMysteryEnthusiast.id,
//     );
//
//     Await testEngine.playCard(cardUnderTest);
//     Const webbyInPlay = testEngine.getByZoneAndId(
//       "play",
//       WebbyVanderquackMysteryEnthusiast.id,
//     );
//     Expect(webbyInPlay.zone).toBe("play");
//   });
//
//   It("CONTAGIOUS ENERGY - When you play this character, chosen character gets +1 {S} this turn", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: webbyVanderquackMysteryEnthusiast.cost,
//         Hand: [webbyVanderquackMysteryEnthusiast],
//       },
//       {
//         Play: [mickeyMouseDetective],
//       },
//     );
//
//     Const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//     // Verify Mickey's base strength
//     Expect(mickey.strength).toBe(mickeyMouseDetective.strength);
//
//     // Play Webby
//     Await testEngine.playCard(webbyVanderquackMysteryEnthusiast);
//
//     // Target Mickey for the +1 strength bonus
//     Await testEngine.resolveTopOfStack({ targets: [mickey] });
//
//     // Mickey should have +1 strength this turn
//     Expect(mickey.strength).toBe(mickeyMouseDetective.strength + 1);
//
//     // Pass turn and verify the bonus expires
//     TestEngine.passTurn();
//     Expect(mickey.strength).toBe(mickeyMouseDetective.strength);
//   });
//
//   It("CONTAGIOUS ENERGY - Can target herself for the +1 {S} bonus", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: webbyVanderquackMysteryEnthusiast.cost,
//       Hand: [webbyVanderquackMysteryEnthusiast],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       WebbyVanderquackMysteryEnthusiast,
//     );
//
//     // Play Webby
//     Await testEngine.playCard(webbyVanderquackMysteryEnthusiast);
//
//     // Target herself for the +1 strength bonus
//     Await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });
//
//     // Webby should have +1 strength this turn
//     Expect(cardUnderTest.strength).toBe(
//       WebbyVanderquackMysteryEnthusiast.strength + 1,
//     );
//
//     // Pass turn and verify the bonus expires
//     TestEngine.passTurn();
//     Expect(cardUnderTest.strength).toBe(
//       WebbyVanderquackMysteryEnthusiast.strength,
//     );
//   });
//
//   It("CONTAGIOUS ENERGY - Ability should be present and functional", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: webbyVanderquackMysteryEnthusiast.cost,
//       Hand: [webbyVanderquackMysteryEnthusiast],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       WebbyVanderquackMysteryEnthusiast.id,
//     );
//
//     // Check that the ability is present
//     Expect(webbyVanderquackMysteryEnthusiast.abilities).toBeDefined();
//     Expect(webbyVanderquackMysteryEnthusiast.abilities?.length).toBeGreaterThan(
//       0,
//     );
//     Expect(webbyVanderquackMysteryEnthusiast.abilities?.[0]?.name).toBe(
//       "CONTAGIOUS ENERGY",
//     );
//
//     // Check that the character is playable
//     Await testEngine.playCard(cardUnderTest);
//     Const webbyInPlay = testEngine.getByZoneAndId(
//       "play",
//       WebbyVanderquackMysteryEnthusiast.id,
//     );
//     Expect(webbyInPlay.zone).toBe("play");
//   });
// });
//
