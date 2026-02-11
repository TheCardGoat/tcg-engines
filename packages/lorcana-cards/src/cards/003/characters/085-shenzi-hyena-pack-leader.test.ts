// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ShenziHyenaPackLeader,
//   UrsulaDeceiver,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { nottinghamPrinceJohnsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Shenzi - Hyena Pack Leader", () => {
//   It("**I WILL DO IT** When this character is at a location, she gets +3 {S}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: nottinghamPrinceJohnsCastle.moveCost,
//       Play: [shenziHyenaPackLeader, nottinghamPrinceJohnsCastle],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(shenziHyenaPackLeader);
//
//     Expect(cardUnderTest.strength).toBe(shenziHyenaPackLeader.strength);
//
//     Await testEngine.moveToLocation({
//       Character: shenziHyenaPackLeader,
//       Location: nottinghamPrinceJohnsCastle,
//     });
//
//     Expect(cardUnderTest.strength).toBe(shenziHyenaPackLeader.strength + 3);
//   });
//
//   It("**WHAT’S THE HURRY?** When this character is at a location, when she challenges another character, you may draw a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: nottinghamPrinceJohnsCastle.moveCost,
//         Play: [shenziHyenaPackLeader, nottinghamPrinceJohnsCastle],
//         Deck: 3,
//       },
//       {
//         Play: [ursulaDeceiver],
//       },
//     );
//
//     Await testEngine.tapCard(ursulaDeceiver);
//     Await testEngine.moveToLocation({
//       Character: shenziHyenaPackLeader,
//       Location: nottinghamPrinceJohnsCastle,
//     });
//
//     Await testEngine.challenge({
//       Attacker: shenziHyenaPackLeader,
//       Defender: ursulaDeceiver,
//     });
//
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 2,
//         Hand: 1,
//       }),
//     );
//   });
// });
//
