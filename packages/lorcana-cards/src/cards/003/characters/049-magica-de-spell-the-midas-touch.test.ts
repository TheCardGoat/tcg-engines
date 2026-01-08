// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import { magicaDeSpellTheMidasTouch } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { luckyDime } from "@lorcanito/lorcana-engine/cards/003/items/items";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Magica De Spell - The Midas Touch", () => {
//   it("All Mine Whenever this character quests, gain lore equal to the cost of one of your items in play.", async () => {
//     const testEngine = new TestEngine({
//       play: [magicaDeSpellTheMidasTouch, luckyDime, dingleHopper],
//     });
//
//     await testEngine.questCard(magicaDeSpellTheMidasTouch);
//     expect(testEngine.getPlayerLore()).toEqual(magicaDeSpellTheMidasTouch.lore);
//     expect(testEngine.stackLayers).toHaveLength(1);
//
//     await testEngine.resolveTopOfStack({ targets: [luckyDime] });
//     expect(testEngine.getPlayerLore()).toEqual(
//       magicaDeSpellTheMidasTouch.lore + luckyDime.cost,
//     );
//   });
// });
//
