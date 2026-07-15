// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { theIslandsIPulledFromTheSea } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Islands I Pulled From The Sea", () => {
//   It("Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [mickeyBraveLittleTailor],
//       Hand: [theIslandsIPulledFromTheSea],
//       Deck: [forbiddenMountainMaleficentsCastle],
//     });
//
//     Await testEngine.playCard(theIslandsIPulledFromTheSea);
//     Await testEngine.resolveTopOfStack({
//       Targets: [forbiddenMountainMaleficentsCastle],
//     });
//
//     Expect(
//       TestEngine.getCardModel(forbiddenMountainMaleficentsCastle).zone,
//     ).toBe("hand");
//   });
// });
//
