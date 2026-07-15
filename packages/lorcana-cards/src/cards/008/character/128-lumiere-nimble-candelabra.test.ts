// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { lumiereNimbleCandelabra } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lumiere - Nimble Candelabra", () => {
//   It("QUICK-STEP While you have an item card in your discard, this character gains Evasive. (Only characters with Evasive can challenge them.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: lumiereNimbleCandelabra.cost,
//       Play: [lumiereNimbleCandelabra],
//       Discard: [pawpsicle],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(lumiereNimbleCandelabra);
//
//     Expect(cardUnderTest.hasEvasive).toEqual(true);
//   });
// });
//
