// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldDuckMusketeer,
//   GoofyMusketeer,
//   ScarShamelessFirebrand,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Goofy - Musketeer", () => {
//   Describe("**When you play this character, you may remove up to 2 damage from each of your Musketeer characters**", () => {
//     It("Healing 2 damage from one character", () => {
//       Const testStore = new TestStore({
//         Inkwell: goofyMusketeer.cost,
//         Hand: [goofyMusketeer],
//         Play: [donaldDuckMusketeer],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", goofyMusketeer.id);
//       Const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);
//
//       Target.updateCardMeta({ damage: 2 });
//
//       CardUnderTest.playFromHand({ bodyguard: true });
//
//       TestStore.resolveTopOfStack();
//
//       Expect(cardUnderTest.zone).toEqual("play");
//       Expect(target.meta.damage).toEqual(0);
//     });
//
//     It("Healing 2 damage only to muskeeter characters", () => {
//       Const testStore = new TestStore({
//         Inkwell: goofyMusketeer.cost,
//         Hand: [goofyMusketeer],
//         Play: [donaldDuckMusketeer, scarShamelessFirebrand],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", goofyMusketeer.id);
//       Const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);
//       Const shouldNotBeTarget = testStore.getByZoneAndId(
//         "play",
//         ScarShamelessFirebrand.id,
//       );
//
//       Target.updateCardMeta({ damage: 2 });
//       ShouldNotBeTarget.updateCardMeta({ damage: 2 });
//
//       CardUnderTest.playFromHand({ bodyguard: true });
//
//       TestStore.resolveTopOfStack();
//
//       Expect(cardUnderTest.zone).toEqual("play");
//       Expect(target.meta.damage).toEqual(0);
//       Expect(shouldNotBeTarget.meta.damage).toEqual(2);
//     });
//   });
// });
//
