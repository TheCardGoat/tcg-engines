// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { winnieThePoohHavingAThink } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Winnie the Pooh - Having a Think", () => {
//   It.skip("**HUNNY POT** Whenever this character quests, you may put a card from your hand into your inkwell facedown.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: winnieThePoohHavingAThink.cost,
//       Play: [winnieThePoohHavingAThink],
//       Hand: [winnieThePoohHavingAThink],
//     });
//
//     Await testEngine.playCard(winnieThePoohHavingAThink);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
