// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { jimHawkinsStubbornCabinBoy } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Jim Hawkins - Stubborn Cabin Boy", () => {
//   it.skip("COME HERE, COME HERE, COME HERE! During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn. (While challenging, this character gets +2 {S}.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: jimHawkinsStubbornCabinBoy.cost,
//       play: [jimHawkinsStubbornCabinBoy],
//       hand: [jimHawkinsStubbornCabinBoy],
//     });
//
//     await testEngine.playCard(jimHawkinsStubbornCabinBoy);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
