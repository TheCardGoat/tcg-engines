// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fixitFelixJrDelightedSightseer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { rapunzelsTowerSecludedPrison } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Fix‐It Felix, Jr. - Delighted Sightseer", () => {
//   It("**OH, MY LAND!** When you play this character, if you have a location in play, draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: fixitFelixJrDelightedSightseer.cost,
//       Hand: [fixitFelixJrDelightedSightseer],
//       Play: [rapunzelsTowerSecludedPrison],
//       Deck: 2,
//     });
//
//     Const cardUnderTest = testStore.getCard(fixitFelixJrDelightedSightseer);
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({});
//
//     Expect(testStore.getZonesCardCount().hand).toEqual(1);
//   });
// });
//
// Describe("Regression", () => {
//   It("Doest draw a card if there is no location in play", async () => {
//     Const testStore = new TestEngine(
//       {
//         Inkwell: fixitFelixJrDelightedSightseer.cost,
//         Hand: [fixitFelixJrDelightedSightseer],
//         Deck: 2,
//       },
//       {
//         Play: [rapunzelsTowerSecludedPrison],
//       },
//     );
//
//     Await testStore.playCard(fixitFelixJrDelightedSightseer);
//
//     Expect(testStore.stackLayers).toHaveLength(0);
//     Expect(testStore.getZonesCardCount().hand).toEqual(0);
//     Expect(testStore.getZonesCardCount().deck).toEqual(2);
//   });
// });
//
