// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BoltDownButNotOut,
//   HeadsHeldHigh,
//   RayaInfiltrationExpert,
//   TheColonelOldSheepdog,
//   YzmaOnEdge,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Heads Held High", () => {
//   It("Remove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.", async () => {
//     Const targets = [theColonelOldSheepdog, boltDownButNotOut];
//
//     Const opponents = [yzmaOnEdge, rayaInfiltrationExpert];
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: headsHeldHigh.cost,
//         Play: targets,
//         Hand: [headsHeldHigh],
//       },
//       {
//         Play: opponents,
//       },
//     );
//
//     For (const target of targets) {
//       Await testEngine.setCardDamage(target, 3);
//     }
//
//     Await testEngine.playCard(headsHeldHigh, { targets });
//
//     For (const target of targets) {
//       Expect(testEngine.getCardModel(target).damage).toEqual(0);
//     }
//
//     For (const opponent of opponents) {
//       Expect(testEngine.getCardModel(opponent).strength).toEqual(
//         Opponent.strength - 3,
//       );
//     }
//
//     Await testEngine.passTurn();
//
//     For (const opponent of opponents) {
//       Expect(testEngine.getCardModel(opponent).strength).toEqual(
//         Opponent.strength,
//       );
//     }
//   });
// });
//
