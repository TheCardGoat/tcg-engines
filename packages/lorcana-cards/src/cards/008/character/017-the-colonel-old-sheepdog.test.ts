// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { theColonelOldSheepdog } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Colonel - Old Sheepdog", () => {
//   it.skip("WE'VE GOT 'EM OUTNUMBERED While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: theColonelOldSheepdog.cost,
//       play: [theColonelOldSheepdog],
//       hand: [theColonelOldSheepdog],
//     });
//
//     await testEngine.playCard(theColonelOldSheepdog);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
