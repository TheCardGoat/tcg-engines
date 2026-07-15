// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { theBareNecessities } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Bare Necessities", () => {
//   It("Chosen opponent reveals their hand and discards a non-character card of your choice.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: theBareNecessities.cost,
//         Hand: [theBareNecessities],
//       },
//       {
//         Hand: [hakunaMatata],
//       },
//     );
//
//     Await testEngine.playCard(theBareNecessities, { targets: [hakunaMatata] });
//
//     Expect(testEngine.getCardModel(hakunaMatata).zone).toEqual("discard");
//   });
// });
//
