// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   boltDownButNotOut,
//   headsHeldHigh,
//   rayaInfiltrationExpert,
//   theColonelOldSheepdog,
//   yzmaOnEdge,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Heads Held High", () => {
//   it("Remove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.", async () => {
//     const targets = [theColonelOldSheepdog, boltDownButNotOut];
//
//     const opponents = [yzmaOnEdge, rayaInfiltrationExpert];
//     const testEngine = new TestEngine(
//       {
//         inkwell: headsHeldHigh.cost,
//         play: targets,
//         hand: [headsHeldHigh],
//       },
//       {
//         play: opponents,
//       },
//     );
//
//     for (const target of targets) {
//       await testEngine.setCardDamage(target, 3);
//     }
//
//     await testEngine.playCard(headsHeldHigh, { targets });
//
//     for (const target of targets) {
//       expect(testEngine.getCardModel(target).damage).toEqual(0);
//     }
//
//     for (const opponent of opponents) {
//       expect(testEngine.getCardModel(opponent).strength).toEqual(
//         opponent.strength - 3,
//       );
//     }
//
//     await testEngine.passTurn();
//
//     for (const opponent of opponents) {
//       expect(testEngine.getCardModel(opponent).strength).toEqual(
//         opponent.strength,
//       );
//     }
//   });
// });
//
