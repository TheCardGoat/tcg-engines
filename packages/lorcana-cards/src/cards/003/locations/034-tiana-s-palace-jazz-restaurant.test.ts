// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GenieSupportiveFriend,
//   HydrosIceTitan,
//   IagoPrettyPolly,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { tianasPalaceJazzRestaurant } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tiana's Palace - Jazz Restaurant", () => {
//   It("**NIGHT OUT** Characters can't be challenged while here.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: tianasPalaceJazzRestaurant.moveCost * 2,
//         Play: [
//           TianasPalaceJazzRestaurant,
//           GenieSupportiveFriend,
//           HydrosIceTitan,
//         ],
//       },
//       {
//         Play: [iagoPrettyPolly],
//         Deck: 3,
//       },
//     );
//
//     Await testEngine.tapCard(hydrosIceTitan);
//     Await testEngine.tapCard(genieSupportiveFriend);
//
//     Const attacker = testEngine.getCardModel(iagoPrettyPolly);
//     Const notAtLocation = testEngine.getCardModel(hydrosIceTitan);
//     Const atLocation = testEngine.getCardModel(genieSupportiveFriend);
//
//     Expect(attacker.canChallenge(atLocation)).toBe(true);
//
//     Await testEngine.moveToLocation({
//       Location: tianasPalaceJazzRestaurant,
//       Character: genieSupportiveFriend,
//     });
//
//     Await testEngine.passTurn();
//
//     Expect(attacker.canChallenge(notAtLocation)).toBe(true);
//     Expect(attacker.canChallenge(atLocation)).toBe(false);
//   });
// });
//
