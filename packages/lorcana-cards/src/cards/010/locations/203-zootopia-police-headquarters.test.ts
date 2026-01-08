// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { zootopiaPoliceHeadquarters } from "@lorcanito/lorcana-engine/cards/010";
// import {
//   mickeyMouseDetective,
//   simbaKingInTheMaking,
// } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { docBoldKnight } from "../../005/characters/193-doc-bold-knight";
//
// describe("Zootopia - Police Headquarters", () => {
//   describe("NEW INFORMATION - Once during your turn, whenever you move a character here, you may draw a card, then choose and discard a card.", () => {
//     it("should trigger and draw a card when moving a character to the location after playing", async () => {
//       const testEngine = new TestEngine({
//         inkwell: zootopiaPoliceHeadquarters.moveCost * 2,
//         hand: [simbaKingInTheMaking],
//         play: [zootopiaPoliceHeadquarters, mickeyMouseDetective, docBoldKnight],
//       });
//
//       await testEngine.moveToLocation({
//         location: zootopiaPoliceHeadquarters,
//         character: docBoldKnight,
//       });
//
//       // Doc is the first character to move to the location
//       expect(testEngine.stackLayers).toHaveLength(1);
//
//       await testEngine.acceptOptionalLayer();
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // Discarding Simba
//       await testEngine.resolveTopOfStack({ targets: [simbaKingInTheMaking] });
//       expect(testEngine.getCardModel(simbaKingInTheMaking).zone).toBe(
//         "discard",
//       );
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//       // Second character should NOT activate the ability
//       await testEngine.moveToLocation({
//         location: zootopiaPoliceHeadquarters,
//         character: mickeyMouseDetective,
//       });
//       expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
