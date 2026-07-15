// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { jimHawkinsStubbornCabinBoy } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jim Hawkins - Stubborn Cabin Boy", () => {
//   It.skip("COME HERE, COME HERE, COME HERE! During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn. (While challenging, this character gets +2 {S}.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jimHawkinsStubbornCabinBoy.cost,
//       Play: [jimHawkinsStubbornCabinBoy],
//       Hand: [jimHawkinsStubbornCabinBoy],
//     });
//
//     Await testEngine.playCard(jimHawkinsStubbornCabinBoy);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
