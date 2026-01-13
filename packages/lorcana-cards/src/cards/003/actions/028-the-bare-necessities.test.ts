// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { theBareNecessities } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Bare Necessities", () => {
//   it("Chosen opponent reveals their hand and discards a non-character card of your choice.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: theBareNecessities.cost,
//         hand: [theBareNecessities],
//       },
//       {
//         hand: [hakunaMatata],
//       },
//     );
//
//     await testEngine.playCard(theBareNecessities, { targets: [hakunaMatata] });
//
//     expect(testEngine.getCardModel(hakunaMatata).zone).toEqual("discard");
//   });
// });
//
