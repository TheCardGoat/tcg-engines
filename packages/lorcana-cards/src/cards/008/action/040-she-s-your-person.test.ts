// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseMusketeer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   MickeyMouseGiantMouse,
//   ShesYourPerson,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("She's Your Person", () => {
//   Describe("Choose one:", () => {
//     It("- Remove up to 3 damage from chosen character.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: shesYourPerson.cost,
//         Play: [mickeyMouseGiantMouse],
//         Hand: [shesYourPerson],
//       });
//
//       Await testEngine.setCardDamage(mickeyMouseGiantMouse, 5);
//
//       Await testEngine.playCard(
//         ShesYourPerson,
//         {
//           Mode: "1",
//         },
//         True,
//       );
//
//       Await testEngine.resolveTopOfStack({
//         Targets: [mickeyMouseGiantMouse],
//       });
//
//       Expect(testEngine.getCardModel(mickeyMouseGiantMouse).damage).toEqual(2);
//     });
//
//     It("- Remove up to 3 damage from each of your characters with Bodyguard.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: shesYourPerson.cost,
//         Play: [mickeyMouseGiantMouse, mickeyMouseMusketeer],
//         Hand: [shesYourPerson],
//       });
//
//       Await testEngine.setCardDamage(mickeyMouseGiantMouse, 5);
//       Await testEngine.setCardDamage(mickeyMouseMusketeer, 4);
//
//       Await testEngine.playCard(shesYourPerson, {
//         Mode: "2",
//       });
//
//       Expect(testEngine.getCardModel(mickeyMouseGiantMouse).damage).toEqual(2);
//       Expect(testEngine.getCardModel(mickeyMouseMusketeer).damage).toEqual(1);
//     });
//   });
// });
//
