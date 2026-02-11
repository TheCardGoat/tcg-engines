// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { plutoFriendlyPooch } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pluto - Friendly Pooch", () => {
//   It.skip("**GOOD DOG** {E} – You pay 1 {I} less for the next character you play this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: plutoFriendlyPooch.cost,
//       Play: [plutoFriendlyPooch],
//       Hand: [plutoFriendlyPooch],
//     });
//
//     Await testEngine.playCard(plutoFriendlyPooch);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
