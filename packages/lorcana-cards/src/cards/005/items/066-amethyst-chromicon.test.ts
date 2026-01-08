// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { amethystChromicon } from "@lorcanito/lorcana-engine/cards/005/items/items";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Amethyst Chromicon", () => {
//   it.skip("**AMETHYST LIGHT** {E}− Each player may draw a card.", () => {
//     const testEngine = new TestEngine(
//       {
//         play: [amethystChromicon],
//         deck: 2,
//       },
//       {
//         deck: 2,
//       },
//     );
//
//     testEngine.activateCard(amethystChromicon);
//
//     testEngine.acceptOptionalLayer();
//     expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       expect.objectContaining({ deck: 1, hand: 1 }),
//     );
//
//     testEngine.changeActivePlayer("player_two");
//     testEngine.acceptOptionalLayer();
//     expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       expect.objectContaining({ deck: 1, hand: 1 }),
//     );
//   });
// });
//
