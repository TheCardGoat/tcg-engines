// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   diabloDevotedHerald,
//   luisaMadrigalRockOfTheFamily,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("**I'M THE STRONG ONE** While you have another character in play, this character gets +2 {S}.", () => {
//   it("Alone", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       play: [luisaMadrigalRockOfTheFamily],
//     });
//
//     expect(testEngine.getCardModel(luisaMadrigalRockOfTheFamily).strength).toBe(
//       2,
//     );
//   });
//   it("Not alone", async () => {
//     const testEngine = new TestEngine({
//       inkwell: luisaMadrigalRockOfTheFamily.cost,
//       play: [luisaMadrigalRockOfTheFamily, diabloDevotedHerald],
//     });
//
//     expect(testEngine.getCardModel(luisaMadrigalRockOfTheFamily).strength).toBe(
//       4,
//     );
//   });
// });
//
