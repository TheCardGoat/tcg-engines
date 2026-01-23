// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { fireTheCannons } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Fire the Cannons!", () => {
//   it.skip("Deal 2 damage to chosen character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: fireTheCannons.cost,
//       play: [fireTheCannons],
//       hand: [fireTheCannons],
//     });
//
//     await testEngine.playCard(fireTheCannons);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
