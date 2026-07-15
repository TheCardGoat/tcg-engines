// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mauiDemiGod } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   MoanaSelftaughtSailor,
//   TinkerBellQueenOfTheAzuriteFairies,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Moana - Self-Taught Sailor", () => {
//   Describe("LEARNING THE ROPES This character can't challenge unless you have a Captain character in play.", () => {
//     It("No captain in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [moanaSelftaughtSailor],
//         },
//         {
//           Play: [mauiDemiGod],
//         },
//       );
//       Const cardUnderTest = testEngine.getCardModel(moanaSelftaughtSailor);
//       Const opponent = testEngine.getCardModel(mauiDemiGod);
//
//       Await testEngine.tapCard(mauiDemiGod);
//
//       Expect(opponent.exerted).toBe(true);
//       Expect(cardUnderTest.canChallenge(opponent)).toBe(false);
//
//       Await testEngine.challenge({
//         Attacker: moanaSelftaughtSailor,
//         Defender: mauiDemiGod,
//       });
//
//       Expect(opponent.damage).toBe(0);
//       Expect(opponent.zone).toBe("play");
//
//       Expect(cardUnderTest.damage).toBe(0);
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("With captain in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [moanaSelftaughtSailor, tinkerBellQueenOfTheAzuriteFairies],
//         },
//         {
//           Play: [mauiDemiGod],
//         },
//       );
//       Const cardUnderTest = testEngine.getCardModel(moanaSelftaughtSailor);
//       Const opponent = testEngine.getCardModel(mauiDemiGod);
//
//       Await testEngine.tapCard(mauiDemiGod);
//
//       Expect(opponent.exerted).toBe(true);
//       Expect(cardUnderTest.canChallenge(opponent)).toBe(true);
//
//       Await testEngine.challenge({
//         Attacker: moanaSelftaughtSailor,
//         Defender: mauiDemiGod,
//       });
//
//       Expect(opponent.damage).toBe(moanaSelftaughtSailor.strength);
//       Expect(opponent.zone).toBe("play");
//
//       Expect(cardUnderTest.zone).toBe("discard");
//     });
//   });
// });
//
