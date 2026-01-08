// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   brunoMadrigalSingleminded,
//   camiloMadrigalAtTheCenterOfAttention,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Bruno Madrigal - Single-Minded", () => {
//   it("STANDING TALL When you play this character, chosen opposing character can’t ready at the start of their next turn.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: brunoMadrigalSingleminded.cost,
//         hand: [brunoMadrigalSingleminded],
//       },
//       {
//         play: [camiloMadrigalAtTheCenterOfAttention],
//       },
//     );
//
//     await testEngine.exertCard(camiloMadrigalAtTheCenterOfAttention);
//
//     await testEngine.playCard(brunoMadrigalSingleminded, {
//       targets: [camiloMadrigalAtTheCenterOfAttention],
//     });
//
//     await testEngine.passTurn();
//
//     expect(
//       testEngine.getCardModel(camiloMadrigalAtTheCenterOfAttention).exerted,
//     ).toBe(true);
//   });
// });
//
