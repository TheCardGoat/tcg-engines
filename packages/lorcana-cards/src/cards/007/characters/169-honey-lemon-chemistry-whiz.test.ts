// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { honeyLemonChemistryWhiz } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Honey Lemon - Chemistry Whiz", () => {
//   it.skip("PRETTY GREAT, HUH? Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: honeyLemonChemistryWhiz.cost,
//       play: [honeyLemonChemistryWhiz],
//       hand: [honeyLemonChemistryWhiz],
//     });
//
//     await testEngine.playCard(honeyLemonChemistryWhiz);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
