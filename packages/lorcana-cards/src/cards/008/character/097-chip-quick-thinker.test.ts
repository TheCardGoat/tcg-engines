// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChipQuickThinker,
//   DaleBumbler,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Chip - Quick Thinker", () => {
//   It("I'LL HANDLE IT When you play this character, choose an opponent to discard a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: chipQuickThinker.cost,
//         Hand: [chipQuickThinker],
//       },
//       {
//         Hand: [daleBumbler],
//       },
//     );
//
//     Await testEngine.playCard(chipQuickThinker);
//     Await testEngine.changeActivePlayer();
//     TestEngine.resolveTopOfStack({ targets: [daleBumbler] });
//
//     Expect(testEngine.getCardModel(daleBumbler).zone).toEqual("discard");
//   });
// });
//
