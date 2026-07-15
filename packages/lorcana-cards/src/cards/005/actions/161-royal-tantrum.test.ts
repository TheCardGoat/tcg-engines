// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { royalTantrum } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import {
//   AmberChromiconItem,
//   HalfHexwellCrown,
//   HealingDecanterItem,
//   QueensSensorCoreItem,
//   Retrosphere,
// } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Royal Tantrum", () => {
//   Describe("Banish any number of your items, then draw a card for each item banished this way.", () => {
//     It("Banishes just one item", () => {
//       Const testStore = new TestStore({
//         Deck: 10,
//         Inkwell: royalTantrum.cost,
//         Hand: [royalTantrum],
//         Play: [
//           QueensSensorCoreItem,
//           AmberChromiconItem,
//           HealingDecanterItem,
//           Retrosphere,
//           HalfHexwellCrown,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getCard(royalTantrum);
//       Const target = testStore.getCard(healingDecanterItem);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("discard");
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ deck: 9, hand: 1, discard: 2 }),
//       );
//     });
//
//     It("Banishing more than one, but not all", () => {
//       Const testStore = new TestStore({
//         Deck: 10,
//         Inkwell: royalTantrum.cost,
//         Hand: [royalTantrum],
//         Play: [
//           QueensSensorCoreItem,
//           AmberChromiconItem,
//           HealingDecanterItem,
//           Retrosphere,
//           HalfHexwellCrown,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getCard(royalTantrum);
//       Const target = testStore.getCard(healingDecanterItem);
//       Const anotherTarget = testStore.getCard(queensSensorCoreItem);
//       Const yetAnotherTarget = testStore.getCard(amberChromiconItem);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({
//         Targets: [target, anotherTarget, yetAnotherTarget],
//       });
//
//       Expect(target.zone).toBe("discard");
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ deck: 7, hand: 3, discard: 4 }),
//       );
//     });
//   });
// });
//
