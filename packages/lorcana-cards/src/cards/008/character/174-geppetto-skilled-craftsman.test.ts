// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import {
//   MauricesMachine,
//   UnconventionalTool,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { geppettoSkilledCraftsman } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Geppetto - Skilled Craftsman", () => {
//   It("SEEKING INSPIRATION Whenever this character quests, you may choose and discard any number of item cards to gain 1 lore for each item card discarded this way.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: geppettoSkilledCraftsman.cost,
//       Play: [geppettoSkilledCraftsman],
//       Hand: [pawpsicle, mauricesMachine, unconventionalTool],
//     });
//
//     Await testEngine.questCard(geppettoSkilledCraftsman);
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({
//       Targets: [mauricesMachine, unconventionalTool],
//     });
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(4);
//
//     Expect(testEngine.getCardModel(pawpsicle).zone).toBe("hand");
//   });
// });
//
