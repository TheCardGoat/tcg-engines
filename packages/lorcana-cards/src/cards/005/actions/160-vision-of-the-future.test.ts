// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MaleficentMonstrousDragon,
//   MauiHeroToAll,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { sisuEmpoweredSibling } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { iceBlock } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { visionOfTheFuture } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { mauiHalfshark } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Vision of the Future", () => {
//   It("Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order. - Take one card", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: visionOfTheFuture.cost,
//       Hand: [visionOfTheFuture],
//       Deck: [
//         MaleficentMonstrousDragon,
//         MauiHalfshark,
//         HiramFlavershamToymaker,
//         Pawpsicle,
//         IceBlock,
//         SisuEmpoweredSibling,
//         MauiHeroToAll,
//       ],
//     });
//
//     Await testEngine.playCard(visionOfTheFuture);
//
//     Await testEngine.resolveTopOfStack({
//       Scry: {
//         Bottom: [
//           HiramFlavershamToymaker,
//           Pawpsicle,
//           IceBlock,
//           SisuEmpoweredSibling,
//         ],
//         Hand: [mauiHeroToAll],
//       },
//     });
//
//     Expect(testEngine.getCardZone(mauiHeroToAll)).toEqual("hand");
//
//     Const bottomCard = testEngine.testStore.getZonesCards().deck[0];
//     Const secondBottomCard = testEngine.testStore.getZonesCards().deck[1];
//     Const thirdBottomCard = testEngine.testStore.getZonesCards().deck[2];
//     Const fourthBottomCard = testEngine.testStore.getZonesCards().deck[3];
//
//     Expect(bottomCard?.lorcanitoCard?.name).toEqual(
//       HiramFlavershamToymaker.name,
//     );
//     Expect(secondBottomCard?.lorcanitoCard?.name).toEqual(pawpsicle.name);
//     Expect(thirdBottomCard?.lorcanitoCard?.name).toEqual(iceBlock.name);
//     Expect(fourthBottomCard?.lorcanitoCard?.name).toEqual(
//       SisuEmpoweredSibling.name,
//     );
//   });
// });
//
