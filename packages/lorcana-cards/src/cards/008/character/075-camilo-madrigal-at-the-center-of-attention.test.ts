// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CamiloMadrigalAtTheCenterOfAttention,
//   TheSultanRoyalApparition,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Camilo Madrigal - At the Center of Attention", () => {
//   It("BIS! BIS! When this character is banished in a challenge, return this card to your hand.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [camiloMadrigalAtTheCenterOfAttention],
//       },
//       {
//         Play: [theSultanRoyalApparition],
//       },
//     );
//
//     Await testEngine.challenge({
//       Attacker: camiloMadrigalAtTheCenterOfAttention,
//       Defender: theSultanRoyalApparition,
//       ExertDefender: true,
//     });
//
//     Expect(
//       TestEngine.getCardModel(camiloMadrigalAtTheCenterOfAttention).zone,
//     ).toEqual("hand");
//   });
// });
//
