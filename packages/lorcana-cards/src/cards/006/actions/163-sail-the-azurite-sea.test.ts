// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   Microbots,
//   SailTheAzuriteSea,
//   YokaiScientificSupervillain,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Sail The Azurite Sea", () => {
//   It("This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: sailTheAzuriteSea.cost,
//       Hand: [sailTheAzuriteSea, microbots, yokaiScientificSupervillain],
//       Deck: 6,
//     });
//
//     Await testEngine.putIntoInkwell(microbots);
//
//     Expect(
//       TestEngine.store.tableStore.getTable("player_one").canAddToInkwell(),
//     ).toEqual(false);
//
//     Await testEngine.playCard(sailTheAzuriteSea);
//
//     Expect(
//       TestEngine.store.tableStore.getTable("player_one").canAddToInkwell(),
//     ).toEqual(true);
//
//     Await testEngine.putIntoInkwell(yokaiScientificSupervillain);
//
//     Expect(
//       TestEngine.store.tableStore.getTable("player_one").canAddToInkwell(),
//     ).toEqual(false);
//   });
// });
//
