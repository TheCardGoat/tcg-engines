// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { missBiancaInternationalRescueAidSocietyAgent } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { andThenAlongCameZeus } from "../actions/actions";
//
// Describe("Miss Bianca - International Rescue Aid Society Agent", () => {
//   It("**Singer** 4 _(This character counts as cost 4 to sing songs.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 2,
//         Hand: [andThenAlongCameZeus],
//         Play: [missBiancaInternationalRescueAidSocietyAgent],
//       },
//       {
//         Play: [hiramFlavershamToymaker],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(
//       MissBiancaInternationalRescueAidSocietyAgent,
//     );
//     Const song = testEngine.getCardModel(andThenAlongCameZeus);
//     Const target = testEngine.getCardModel(hiramFlavershamToymaker);
//
//     Expect(cardUnderTest.hasSinger).toBe(true);
//
//     CardUnderTest.sing(song);
//     Await testEngine.resolveTopOfStack({ targets: [target] }, true);
//
//     Expect(testEngine.getCardZone(song)).toBe("discard");
//     Expect(target.damage).toBe(5);
//   });
// });
//
