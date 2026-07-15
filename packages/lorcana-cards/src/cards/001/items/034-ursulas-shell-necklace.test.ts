// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { ursulaShellNecklace } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import {
//   GrabYourSword,
//   HakunaMatata,
//   Reflection,
// } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ursula's Shell Necklace", () => {
//   Describe('"NOW, SING! - Whenever you play a song, you may pay 1 **{I}** to draw a card.', () => {
//     It("Drawing cards", () => {
//       Const testStore = new TestStore({
//         Deck: 2,
//         Inkwell: hakunaMatata.cost + grabYourSword.cost + 2,
//         Hand: [hakunaMatata, grabYourSword],
//         Play: [ursulaShellNecklace],
//       });
//
//       Const aTarget = testStore.getByZoneAndId("hand", hakunaMatata.id);
//       Const anotherTarget = testStore.getByZoneAndId("hand", grabYourSword.id);
//
//       ATarget.playFromHand();
//       TestStore.resolveTopOfStack();
//
//       Expect(testStore.getZonesCardCount().deck).toBe(1);
//       Expect(testStore.getZonesCardCount().hand).toBe(2);
//
//       AnotherTarget.playFromHand();
//       TestStore.resolveTopOfStack();
//
//       Expect(testStore.getZonesCardCount().deck).toBe(0);
//       Expect(testStore.getZonesCardCount().hand).toBe(2);
//       Expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     It("Not having ink to pay cost should skip effect", () => {
//       Const testStore = new TestStore({
//         Deck: 2,
//         Inkwell: hakunaMatata.cost,
//         Hand: [hakunaMatata],
//         Play: [ursulaShellNecklace],
//       });
//
//       Const aTarget = testStore.getByZoneAndId("hand", hakunaMatata.id);
//
//       ATarget.playFromHand();
//       TestStore.resolveTopOfStack();
//
//       Expect(testStore.getZonesCardCount().deck).toBe(2);
//       Expect(testStore.getZonesCardCount().hand).toBe(0);
//
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     It("Skipping effects", () => {
//       Const testStore = new TestStore({
//         Deck: 2,
//         Inkwell: hakunaMatata.cost + grabYourSword.cost,
//         Hand: [hakunaMatata, grabYourSword],
//         Play: [ursulaShellNecklace],
//       });
//
//       Const aTarget = testStore.getByZoneAndId("hand", hakunaMatata.id);
//       Const anotherTarget = testStore.getByZoneAndId("hand", grabYourSword.id);
//
//       ATarget.playFromHand();
//       TestStore.resolveTopOfStack({ skip: true });
//
//       Expect(testStore.getZonesCardCount().deck).toBe(2);
//       Expect(testStore.getZonesCardCount().hand).toBe(1);
//
//       AnotherTarget.playFromHand();
//       TestStore.resolveTopOfStack({ skip: true });
//
//       Expect(testStore.getZonesCardCount().deck).toBe(2);
//       Expect(testStore.getZonesCardCount().hand).toBe(0);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     // TODO: I don't know the official ruling on this. I'm doing what makes most sense to me.
//     It("Necklace's effect, resolves after the effect that triggers it.", () => {
//       Const testStore = new TestStore({
//         Inkwell: reflection.cost,
//         Hand: [reflection],
//         Play: [ursulaShellNecklace],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         UrsulaShellNecklace.id,
//       );
//       Const aTarget = testStore.getByZoneAndId("hand", reflection.id);
//       ATarget.playFromHand();
//
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(2);
//       Expect(testStore.store.stackLayerStore.layers[0]?.instanceId).toEqual(
//         CardUnderTest.instanceId,
//       );
//       Expect(testStore.store.stackLayerStore.layers[1]?.instanceId).toEqual(
//         ATarget.instanceId,
//       );
//     });
//   });
// });
//
