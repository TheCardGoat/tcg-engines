// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { amethystChromicon } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Amethyst Chromicon", () => {
//   It.skip("**AMETHYST LIGHT** {E}− Each player may draw a card.", () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [amethystChromicon],
//         Deck: 2,
//       },
//       {
//         Deck: 2,
//       },
//     );
//
//     TestEngine.activateCard(amethystChromicon);
//
//     TestEngine.acceptOptionalLayer();
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ deck: 1, hand: 1 }),
//     );
//
//     TestEngine.changeActivePlayer("player_two");
//     TestEngine.acceptOptionalLayer();
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ deck: 1, hand: 1 }),
//     );
//   });
// });
//
