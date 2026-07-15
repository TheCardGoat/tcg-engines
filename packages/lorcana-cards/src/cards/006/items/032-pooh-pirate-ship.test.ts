// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { poohPirateShip } from "@lorcanito/lorcana-engine/cards/006/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pooh Pirate Ship", () => {
//   It.skip("MAKE A RESCUE {E}, 3 {I} – Return a Pirate character card from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: poohPirateShip.cost,
//       Play: [poohPirateShip],
//       Hand: [poohPirateShip],
//     });
//
//     Await testEngine.playCard(poohPirateShip);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
