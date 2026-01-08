// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { plutoFriendlyPooch } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Pluto - Friendly Pooch", () => {
//   it.skip("**GOOD DOG** {E} – You pay 1 {I} less for the next character you play this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: plutoFriendlyPooch.cost,
//       play: [plutoFriendlyPooch],
//       hand: [plutoFriendlyPooch],
//     });
//
//     await testEngine.playCard(plutoFriendlyPooch);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
