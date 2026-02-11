// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { airfoil } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { gatheringKnowledgeAndWisdom } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Airfoil", () => {
//   It("**I GOT TO BE GOING** -> Do nothing on <2 actions played", () => {
//     Const testStore = new TestStore({
//       Inkwell: gatheringKnowledgeAndWisdom.cost,
//       Hand: [gatheringKnowledgeAndWisdom],
//       Play: [airfoil],
//       Deck: [goonsMaleficent],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", airfoil.id);
//     Const action = testStore.getByZoneAndId(
//       "hand",
//       GatheringKnowledgeAndWisdom.id,
//     );
//
//     Action.playFromHand();
//     TestStore.resolveTopOfStack({});
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({});
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 0 }),
//     );
//   });
//
//   It("**I GOT TO BE GOING** -> Draw 1", () => {
//     Const testStore = new TestStore({
//       Inkwell: gatheringKnowledgeAndWisdom.cost * 2,
//       Hand: [gatheringKnowledgeAndWisdom, gatheringKnowledgeAndWisdom],
//       Play: [airfoil],
//       Deck: [goonsMaleficent],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", airfoil.id);
//
//     Const action = testStore.getByZoneAndId(
//       "hand",
//       GatheringKnowledgeAndWisdom.id,
//     );
//
//     Action.playFromHand();
//     TestStore.resolveTopOfStack({});
//
//     Const otherAction = testStore.getByZoneAndId(
//       "hand",
//       GatheringKnowledgeAndWisdom.id,
//     );
//     OtherAction.playFromHand();
//     TestStore.resolveTopOfStack({});
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({});
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1 }),
//     );
//   });
// });
//
