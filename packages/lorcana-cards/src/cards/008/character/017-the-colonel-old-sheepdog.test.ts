// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { theColonelOldSheepdog } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Colonel - Old Sheepdog", () => {
//   It.skip("WE'VE GOT 'EM OUTNUMBERED While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: theColonelOldSheepdog.cost,
//       Play: [theColonelOldSheepdog],
//       Hand: [theColonelOldSheepdog],
//     });
//
//     Await testEngine.playCard(theColonelOldSheepdog);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
