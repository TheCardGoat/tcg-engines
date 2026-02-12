// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { theMatchmakerUnforgivingExpert } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Matchmaker - Unforgiving Expert", () => {
//   It.skip("YOU ARE A DISGRACE! Whenever this character challenges another character, each opponent loses 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: theMatchmakerUnforgivingExpert.cost,
//       Play: [theMatchmakerUnforgivingExpert],
//       Hand: [theMatchmakerUnforgivingExpert],
//     });
//
//     Await testEngine.playCard(theMatchmakerUnforgivingExpert);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
