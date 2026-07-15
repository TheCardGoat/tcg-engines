// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HadesRuthlessTyrant,
//   MickeyMouseGiantMouse,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hades - Ruthless Tyrant", () => {
//   It("SHORT ON PATIENCE When you play this character and whenever he quests, you may deal 2 damage to another chosen character of yours to draw 2 cards.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [hadesRuthlessTyrant, mickeyMouseGiantMouse],
//       Deck: 7,
//     });
//
//     Await testEngine.questCard(hadesRuthlessTyrant);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [mickeyMouseGiantMouse] });
//
//     Expect(testEngine.getCardModel(mickeyMouseGiantMouse).damage).toBe(2);
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 2,
//         Deck: 5,
//       }),
//     );
//   });
// });
//
