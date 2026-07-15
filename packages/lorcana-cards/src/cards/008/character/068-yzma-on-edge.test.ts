// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   MickeyMouseGiantMouse,
//   PullTheLever,
//   WrongLeverAction,
//   YzmaOnEdge,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Yzma - On Edge", () => {
//   It("WHY DO WE EVEN HAVE THAT LEVER? When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: yzmaOnEdge.cost,
//       Hand: [yzmaOnEdge],
//       Discard: [pullTheLever],
//       Deck: [wrongLeverAction, mickeyMouseGiantMouse, mickeyBraveLittleTailor],
//     });
//
//     Await testEngine.playCard(yzmaOnEdge);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({
//       Targets: [wrongLeverAction],
//     });
//
//     Expect(testEngine.getCardModel(wrongLeverAction).zone).toBe("hand");
//   });
// });
//
