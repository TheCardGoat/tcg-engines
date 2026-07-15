// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { tugofwar } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { mickeyMouseGiantMouse } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tug-of-War", () => {
//   It("• Deal 1 damage to each opposing character without **Evasive**.", async () => {
//     Const testStore = new TestEngine(
//       {
//         Inkwell: tugofwar.cost,
//         Hand: [tugofwar],
//       },
//       {
//         Play: [mickeyBraveLittleTailor, mickeyMouseGiantMouse],
//       },
//     );
//
//     Await testStore.playCard(tugofwar);
//     Await testStore.resolveTopOfStack({ mode: "1" });
//
//     Expect(testStore.getCardModel(mickeyBraveLittleTailor).damage).toBe(0);
//     Expect(testStore.getCardModel(mickeyMouseGiantMouse).damage).toBe(1);
//   });
//
//   It("• Deal 3 damage to each opposing character with **Evasive**.", async () => {
//     Const testStore = new TestEngine(
//       {
//         Inkwell: tugofwar.cost,
//         Hand: [tugofwar],
//       },
//       {
//         Play: [mickeyBraveLittleTailor, mickeyMouseGiantMouse],
//       },
//     );
//
//     Await testStore.playCard(tugofwar);
//     Await testStore.resolveTopOfStack({ mode: "2" });
//
//     Expect(testStore.getCardModel(mickeyMouseGiantMouse).damage).toBe(0);
//     Expect(testStore.getCardModel(mickeyBraveLittleTailor).damage).toBe(3);
//   });
// });
//
