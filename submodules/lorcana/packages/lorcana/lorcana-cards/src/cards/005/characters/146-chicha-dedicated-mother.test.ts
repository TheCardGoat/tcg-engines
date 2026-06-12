// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseDetective } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { oneJumpAhead } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import {
//   ChichaDedicatedMother,
//   PetePastryChomper,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Chicha - Dedicated Mother", () => {
//   It("During your turn, when you put a card into your inkwell, if it’s the second card you’ve put into your inkwell this turn, you may draw a card.", () => {
//     Const initialInkwell = oneJumpAhead.cost + mickeyMouseDetective.cost;
//     Const initialDeck = 5;
//     Const initialHand = 3;
//     Const testStore = new TestStore({
//       Inkwell: initialInkwell,
//       Play: [chichaDedicatedMother],
//       Hand: [oneJumpAhead, mickeyMouseDetective, petePastryChomper],
//       Deck: initialDeck,
//     });
//
//     Const cardToInkwell = testStore.getCard(petePastryChomper);
//
//     CardToInkwell.addToInkwell();
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: initialHand - 1,
//         Inkwell: initialInkwell + 1,
//         Deck: initialDeck,
//       }),
//     );
//
//     Const rampOne = testStore.getCard(oneJumpAhead);
//     RampOne.playFromHand();
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: initialHand - 2,
//         Inkwell: initialInkwell + 2,
//         Deck: initialDeck - 1,
//       }),
//     );
//
//     Expect(testStore.stackLayers).toHaveLength(1);
//     TestStore.resolveOptionalAbility();
//     Expect(testStore.stackLayers).toHaveLength(0);
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: initialHand - 1,
//         Inkwell: initialInkwell + 2,
//         Deck: initialDeck - 2,
//       }),
//     );
//
//     Const rampTwo = testStore.getCard(mickeyMouseDetective);
//     RampTwo.playFromHand();
//     TestStore.resolveOptionalAbility();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: initialHand - 2,
//         Inkwell: initialInkwell + 3,
//         Deck: initialDeck - 3,
//       }),
//     );
//
//     Expect(testStore.stackLayers).toHaveLength(0);
//   });
// });
//
