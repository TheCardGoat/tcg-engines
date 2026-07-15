// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { magicaDeSpellTheMidasTouch } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { luckyDime } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Magica De Spell - The Midas Touch", () => {
//   It("All Mine Whenever this character quests, gain lore equal to the cost of one of your items in play.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [magicaDeSpellTheMidasTouch, luckyDime, dingleHopper],
//     });
//
//     Await testEngine.questCard(magicaDeSpellTheMidasTouch);
//     Expect(testEngine.getPlayerLore()).toEqual(magicaDeSpellTheMidasTouch.lore);
//     Expect(testEngine.stackLayers).toHaveLength(1);
//
//     Await testEngine.resolveTopOfStack({ targets: [luckyDime] });
//     Expect(testEngine.getPlayerLore()).toEqual(
//       MagicaDeSpellTheMidasTouch.lore + luckyDime.cost,
//     );
//   });
// });
//
