// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BeastWounded,
//   HerculesClumsyKid,
//   ZeusMrLightningBolts,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Zeus - Mr. Lightning Bolts", () => {
//   It("**TARGET PRACTICE** Whenever this character challenges another character, he gets + {S} equal to the {S} of chosen character this turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [zeusMrLightningBolts],
//       },
//       {
//         Play: [beastWounded, herculesClumsyKid],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(zeusMrLightningBolts);
//
//     Await testEngine.challenge({
//       Attacker: zeusMrLightningBolts,
//       Defender: beastWounded,
//       ExertDefender: true,
//     });
//
//     Expect(cardUnderTest.strength).toBe(zeusMrLightningBolts.strength);
//     Await testEngine.resolveTopOfStack({ targets: [herculesClumsyKid] });
//     Expect(cardUnderTest.strength).toBe(
//       ZeusMrLightningBolts.strength + herculesClumsyKid.strength,
//     );
//
//     Await testEngine.passTurn();
//     Expect(cardUnderTest.strength).toBe(zeusMrLightningBolts.strength);
//   });
// });
//
