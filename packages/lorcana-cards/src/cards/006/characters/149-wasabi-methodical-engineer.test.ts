// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { wasabiMethodicalEngineer } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Wasabi - Methodical Engineer", () => {
//   Describe("**BLADES OF FURY** When you play this character, you may banish chosen item. Its player gains 1 lore.", () => {
//     It("Targeting your own card", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: wasabiMethodicalEngineer.cost,
//         Hand: [wasabiMethodicalEngineer],
//         Play: [pawpsicle],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(wasabiMethodicalEngineer);
//       Const target = testEngine.getCardModel(pawpsicle);
//
//       Await testEngine.playCard(cardUnderTest);
//
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//       Expect(testEngine.getLoreForPlayer()).toEqual(1);
//     });
//
//     It("Targeting opponent's card", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: wasabiMethodicalEngineer.cost,
//           Hand: [wasabiMethodicalEngineer],
//         },
//         {
//           Play: [pawpsicle],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(wasabiMethodicalEngineer);
//       Const target = testEngine.getCardModel(pawpsicle);
//
//       Await testEngine.playCard(cardUnderTest);
//
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//       Expect(testEngine.getLoreForPlayer("player_two")).toEqual(1);
//     });
//   });
// });
//
