// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AmethystChromicon,
//   Retrosphere,
// } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Retrosphere", () => {
//   It("**EXTRACT OF AMETHYST** 2 {I}, Banish this item – Return chosen character, item, or location with cost 3 or less to their player’s hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 2,
//       Play: [retrosphere, amethystChromicon],
//     });
//
//     Const cardUnderTest = await testEngine.activateCard(retrosphere);
//
//     Await testEngine.resolveTopOfStack({ targets: [amethystChromicon] });
//
//     Expect(cardUnderTest.zone).toEqual("discard");
//     Expect(testEngine.getCardModel(amethystChromicon).zone).toEqual("hand");
//   });
// });
//
