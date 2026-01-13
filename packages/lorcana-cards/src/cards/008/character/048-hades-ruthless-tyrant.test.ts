// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   hadesRuthlessTyrant,
//   mickeyMouseGiantMouse,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Hades - Ruthless Tyrant", () => {
//   it("SHORT ON PATIENCE When you play this character and whenever he quests, you may deal 2 damage to another chosen character of yours to draw 2 cards.", async () => {
//     const testEngine = new TestEngine({
//       play: [hadesRuthlessTyrant, mickeyMouseGiantMouse],
//       deck: 7,
//     });
//
//     await testEngine.questCard(hadesRuthlessTyrant);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [mickeyMouseGiantMouse] });
//
//     expect(testEngine.getCardModel(mickeyMouseGiantMouse).damage).toBe(2);
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         hand: 2,
//         deck: 5,
//       }),
//     );
//   });
// });
//
