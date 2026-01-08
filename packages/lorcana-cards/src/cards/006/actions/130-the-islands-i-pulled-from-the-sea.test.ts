// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// import { theIslandsIPulledFromTheSea } from "@lorcanito/lorcana-engine/cards/006";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Islands I Pulled From The Sea", () => {
//   it("Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       play: [mickeyBraveLittleTailor],
//       hand: [theIslandsIPulledFromTheSea],
//       deck: [forbiddenMountainMaleficentsCastle],
//     });
//
//     await testEngine.playCard(theIslandsIPulledFromTheSea);
//     await testEngine.resolveTopOfStack({
//       targets: [forbiddenMountainMaleficentsCastle],
//     });
//
//     expect(
//       testEngine.getCardModel(forbiddenMountainMaleficentsCastle).zone,
//     ).toBe("hand");
//   });
// });
//
