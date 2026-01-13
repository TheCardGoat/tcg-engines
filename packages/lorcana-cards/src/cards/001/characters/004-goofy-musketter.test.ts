// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   donaldDuckMusketeer,
//   goofyMusketeer,
//   scarShamelessFirebrand,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Goofy - Musketeer", () => {
//   describe("**When you play this character, you may remove up to 2 damage from each of your Musketeer characters**", () => {
//     it("Healing 2 damage from one character", () => {
//       const testStore = new TestStore({
//         inkwell: goofyMusketeer.cost,
//         hand: [goofyMusketeer],
//         play: [donaldDuckMusketeer],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId("hand", goofyMusketeer.id);
//       const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);
//
//       target.updateCardMeta({ damage: 2 });
//
//       cardUnderTest.playFromHand({ bodyguard: true });
//
//       testStore.resolveTopOfStack();
//
//       expect(cardUnderTest.zone).toEqual("play");
//       expect(target.meta.damage).toEqual(0);
//     });
//
//     it("Healing 2 damage only to muskeeter characters", () => {
//       const testStore = new TestStore({
//         inkwell: goofyMusketeer.cost,
//         hand: [goofyMusketeer],
//         play: [donaldDuckMusketeer, scarShamelessFirebrand],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId("hand", goofyMusketeer.id);
//       const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);
//       const shouldNotBeTarget = testStore.getByZoneAndId(
//         "play",
//         scarShamelessFirebrand.id,
//       );
//
//       target.updateCardMeta({ damage: 2 });
//       shouldNotBeTarget.updateCardMeta({ damage: 2 });
//
//       cardUnderTest.playFromHand({ bodyguard: true });
//
//       testStore.resolveTopOfStack();
//
//       expect(cardUnderTest.zone).toEqual("play");
//       expect(target.meta.damage).toEqual(0);
//       expect(shouldNotBeTarget.meta.damage).toEqual(2);
//     });
//   });
// });
//
