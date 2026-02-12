// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { zootopiaPoliceHeadquarters } from "@lorcanito/lorcana-engine/cards/010";
// Import {
//   MickeyMouseDetective,
//   SimbaKingInTheMaking,
// } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { docBoldKnight } from "../../005/characters/193-doc-bold-knight";
//
// Describe("Zootopia - Police Headquarters", () => {
//   Describe("NEW INFORMATION - Once during your turn, whenever you move a character here, you may draw a card, then choose and discard a card.", () => {
//     It("should trigger and draw a card when moving a character to the location after playing", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: zootopiaPoliceHeadquarters.moveCost * 2,
//         Hand: [simbaKingInTheMaking],
//         Play: [zootopiaPoliceHeadquarters, mickeyMouseDetective, docBoldKnight],
//       });
//
//       Await testEngine.moveToLocation({
//         Location: zootopiaPoliceHeadquarters,
//         Character: docBoldKnight,
//       });
//
//       // Doc is the first character to move to the location
//       Expect(testEngine.stackLayers).toHaveLength(1);
//
//       Await testEngine.acceptOptionalLayer();
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // Discarding Simba
//       Await testEngine.resolveTopOfStack({ targets: [simbaKingInTheMaking] });
//       Expect(testEngine.getCardModel(simbaKingInTheMaking).zone).toBe(
//         "discard",
//       );
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//       // Second character should NOT activate the ability
//       Await testEngine.moveToLocation({
//         Location: zootopiaPoliceHeadquarters,
//         Character: mickeyMouseDetective,
//       });
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
