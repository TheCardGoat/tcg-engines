// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldDuckMusketeer,
//   MickeyMouseMusketeer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { goofyMusketeerSwordsman } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Goofy Musketeer - Swordsman", () => {
//   It("**EN GAWRSH!** Whenever you play a character with **Bodyguard**, ready this character. He can't quest for the rest of this turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 10,
//         Play: [goofyMusketeerSwordsman],
//         Hand: [mickeyMouseMusketeer, donaldDuckMusketeer],
//       },
//       {
//         Play: [hiramFlavershamToymaker],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(goofyMusketeerSwordsman);
//     Const target = testEngine.getCardModel(hiramFlavershamToymaker);
//
//     Await testEngine.tapCard(target);
//
//     // Questing should work and exert goofy
//     Await testEngine.questCard(goofyMusketeerSwordsman);
//     Expect(cardUnderTest.exerted).toBe(true);
//
//     // Playing a musketeer should ready goofy and set quest restriction
//     Await testEngine.playCard(mickeyMouseMusketeer, { bodyguard: true });
//
//     Expect(cardUnderTest.exerted).toBe(false);
//     Expect(cardUnderTest.hasQuestRestriction).toBe(true);
//
//     // Challenging should work and banish target, goofy should be exerted
//     Await testEngine.challenge({
//       Attacker: cardUnderTest,
//       Defender: target,
//     });
//     Expect(cardUnderTest.exerted).toBe(true);
//
//     // Playing a musketeer should ready goofy
//     Await testEngine.playCard(donaldDuckMusketeer, { bodyguard: true });
//
//     Expect(cardUnderTest.exerted).toBe(false);
//
//     // Challenging again shoud work and banish target, goofy should be exerted
//     Await testEngine.challenge({
//       Attacker: cardUnderTest,
//       Defender: target,
//     });
//     Expect(cardUnderTest.exerted).toBe(true);
//     Expect(cardUnderTest.damage).toBe(2);
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
