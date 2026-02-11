// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DruunRavenousPlague,
//   RoyalGuardOctopusSoldier,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Royal Guard - Octopus Soldier", () => {
//   It("HEAVILY ARMED Every time you draw a card, this character gains Challenger +1 for this turn. (Gains +1 {S} while challenging.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [royalGuardOctopusSoldier],
//       },
//       {
//         Play: [druunRavenousPlague],
//       },
//     );
//
//     Const underTest = testEngine.getCardModel(royalGuardOctopusSoldier);
//     Const oppoChar = testEngine.getCardModel(druunRavenousPlague);
//
//     OppoChar.exert();
//
//     Await testEngine.drawCard();
//
//     Expect(testEngine.getCardsByZone("hand").length).toBe(1);
//
//     UnderTest.challenge(oppoChar);
//
//     Expect(oppoChar.damage).toBe(underTest.strength + 1);
//   });
// });
//
