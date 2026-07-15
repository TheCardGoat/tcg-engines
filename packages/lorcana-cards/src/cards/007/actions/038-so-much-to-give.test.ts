// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { soMuchToGive } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("So Much To Give", () => {
//   It("Draw a card. Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: soMuchToGive.cost,
//         Hand: [soMuchToGive],
//         Deck: [hiramFlavershamToymaker],
//       },
//       { play: [tipoGrowingSon] },
//     );
//
//     Await testEngine.playCard(soMuchToGive);
//
//     Const target = testEngine.getCardModel(tipoGrowingSon);
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//     Expect(target.hasAbility("bodyguard")).toBe(true);
//   });
// });
//
