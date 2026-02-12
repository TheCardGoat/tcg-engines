// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { grandmotherFaSpiritedElder } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Grandmother Fa - Spirited Elder", () => {
//   It.skip("I HAVE ALL THE LUCK WE NEED Each time this character is sent on an adventure, you can choose one of your characters to gain +2 {S} for the rest of the turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: grandmotherFaSpiritedElder.cost,
//       Play: [grandmotherFaSpiritedElder],
//       Hand: [grandmotherFaSpiritedElder],
//     });
//
//     Await testEngine.playCard(grandmotherFaSpiritedElder);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
