// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import {
//   GrammaTalaKeeperOfAncientStories,
//   MrSmeeBumblingMate,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { cleansingRainwater } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gramma Tala - Keeper of Ancient Stories", () => {
//   It("**THERE WAS ONLY OCEAN** When you play this character, look at the top 2 cards of your deck. You may add one into your hand. Put the rest on the bottom of your deck in any order.", () => {
//     Const testStore = new TestStore({
//       Inkwell: grammaTalaKeeperOfAncientStories.cost,
//       Hand: [grammaTalaKeeperOfAncientStories],
//       Deck: [mrSmeeBumblingMate, cleansingRainwater],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       GrammaTalaKeeperOfAncientStories.id,
//     );
//     Const target = testStore.getByZoneAndId("deck", mrSmeeBumblingMate.id);
//     Const bottom = testStore.getByZoneAndId("deck", cleansingRainwater.id);
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ scry: { hand: [target], bottom: [bottom] } });
//   });
// });
//
