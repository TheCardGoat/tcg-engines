// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   genieSupportiveFriend,
//   hydrosIceTitan,
//   iagoPrettyPolly,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { tianasPalaceJazzRestaurant } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Tiana's Palace - Jazz Restaurant", () => {
//   it("**NIGHT OUT** Characters can't be challenged while here.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: tianasPalaceJazzRestaurant.moveCost * 2,
//         play: [
//           tianasPalaceJazzRestaurant,
//           genieSupportiveFriend,
//           hydrosIceTitan,
//         ],
//       },
//       {
//         play: [iagoPrettyPolly],
//         deck: 3,
//       },
//     );
//
//     await testEngine.tapCard(hydrosIceTitan);
//     await testEngine.tapCard(genieSupportiveFriend);
//
//     const attacker = testEngine.getCardModel(iagoPrettyPolly);
//     const notAtLocation = testEngine.getCardModel(hydrosIceTitan);
//     const atLocation = testEngine.getCardModel(genieSupportiveFriend);
//
//     expect(attacker.canChallenge(atLocation)).toBe(true);
//
//     await testEngine.moveToLocation({
//       location: tianasPalaceJazzRestaurant,
//       character: genieSupportiveFriend,
//     });
//
//     await testEngine.passTurn();
//
//     expect(attacker.canChallenge(notAtLocation)).toBe(true);
//     expect(attacker.canChallenge(atLocation)).toBe(false);
//   });
// });
//
