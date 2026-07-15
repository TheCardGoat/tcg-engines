// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DiabloDevotedHerald,
//   LuisaMadrigalRockOfTheFamily,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("**I'M THE STRONG ONE** While you have another character in play, this character gets +2 {S}.", () => {
//   It("Alone", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [luisaMadrigalRockOfTheFamily],
//     });
//
//     Expect(testEngine.getCardModel(luisaMadrigalRockOfTheFamily).strength).toBe(
//       2,
//     );
//   });
//   It("Not alone", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: luisaMadrigalRockOfTheFamily.cost,
//       Play: [luisaMadrigalRockOfTheFamily, diabloDevotedHerald],
//     });
//
//     Expect(testEngine.getCardModel(luisaMadrigalRockOfTheFamily).strength).toBe(
//       4,
//     );
//   });
// });
//
