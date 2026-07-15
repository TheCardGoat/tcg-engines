// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MauriceWorldFamousInventor,
//   TinkerBellTinyTactician,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { ursulaShellNecklace } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maurice - World-Famous Inventor", () => {
//   It("Give it a try: Whenever this character quests, you pay 2 {I} less for the next item you play this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: ursulaShellNecklace.cost - 2,
//       Hand: [ursulaShellNecklace],
//       Play: [mauriceWorldFamousInventor],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MauriceWorldFamousInventor.id,
//     );
//
//     Const target = testStore.getByZoneAndId("hand", ursulaShellNecklace.id);
//
//     CardUnderTest.quest();
//     Target.playFromHand();
//
//     Expect(target.zone).toEqual("play");
//     Expect(
//       TestStore.store.tableStore.getTable("player_one").inkAvailable(),
//     ).toEqual(0);
//   });
//
//   Describe("It works!: Whenever you play an item, you may draw a card.", () => {
//     It("It works! - player plays an item", () => {
//       Const testStore = new TestStore({
//         Inkwell: ursulaShellNecklace.cost,
//         Deck: [tinkerBellTinyTactician],
//         Hand: [ursulaShellNecklace],
//         Play: [mauriceWorldFamousInventor],
//       });
//
//       Const target = testStore.getByZoneAndId("hand", ursulaShellNecklace.id);
//
//       Target.playFromHand();
//       TestStore.resolveTopOfStack();
//
//       Expect(target.zone).toEqual("play");
//       Expect(testStore.getZonesCardCount().hand).toEqual(1);
//     });
//
//     It("It works! - Opponent play an item", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: ursulaShellNecklace.cost,
//           Deck: [tinkerBellTinyTactician],
//           Hand: [ursulaShellNecklace],
//         },
//         {
//           Play: [mauriceWorldFamousInventor],
//         },
//       );
//
//       Const target = testStore.getByZoneAndId("hand", ursulaShellNecklace.id);
//
//       Target.playFromHand();
//
//       Expect(target.zone).toEqual("play");
//       Expect(testStore.getZonesCardCount().hand).toEqual(0);
//       Expect(testStore.getZonesCardCount("player_two").hand).toEqual(0);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     It("It works! - Skip Effect", () => {
//       Const testStore = new TestStore({
//         Inkwell: ursulaShellNecklace.cost,
//         Deck: [tinkerBellTinyTactician],
//         Hand: [ursulaShellNecklace],
//         Play: [mauriceWorldFamousInventor],
//       });
//
//       Const target = testStore.getByZoneAndId("hand", ursulaShellNecklace.id);
//
//       Target.playFromHand();
//       TestStore.resolveTopOfStack({ skip: true });
//
//       Expect(target.zone).toEqual("play");
//       Expect(testStore.getZonesCardCount().hand).toEqual(0);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//   });
// });
//
