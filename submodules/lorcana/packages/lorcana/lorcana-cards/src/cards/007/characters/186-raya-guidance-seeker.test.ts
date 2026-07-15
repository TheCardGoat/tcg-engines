// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { rayaGuidanceSeeker } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Raya - Guidance Seeker", () => {
//   It.skip("A GREATER PURPOSE During your turn, whenever a card is put into your inkwell, this character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rayaGuidanceSeeker.cost,
//       Play: [rayaGuidanceSeeker],
//       Hand: [rayaGuidanceSeeker],
//     });
//
//     Await testEngine.playCard(rayaGuidanceSeeker);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
