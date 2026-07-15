// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BrunoMadrigalSingleminded,
//   CamiloMadrigalAtTheCenterOfAttention,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bruno Madrigal - Single-Minded", () => {
//   It("STANDING TALL When you play this character, chosen opposing character can’t ready at the start of their next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: brunoMadrigalSingleminded.cost,
//         Hand: [brunoMadrigalSingleminded],
//       },
//       {
//         Play: [camiloMadrigalAtTheCenterOfAttention],
//       },
//     );
//
//     Await testEngine.exertCard(camiloMadrigalAtTheCenterOfAttention);
//
//     Await testEngine.playCard(brunoMadrigalSingleminded, {
//       Targets: [camiloMadrigalAtTheCenterOfAttention],
//     });
//
//     Await testEngine.passTurn();
//
//     Expect(
//       TestEngine.getCardModel(camiloMadrigalAtTheCenterOfAttention).exerted,
//     ).toBe(true);
//   });
// });
//
