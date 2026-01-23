// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { donaldDuckMusketeer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { jasmineHeirOfAgrabah } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Jasmine - Heir of Agrabah", () => {
//   it("**I'M A FAST LEARNER** When you play this character, remove up to 1 damage from chosen character of yours.", () => {
//     const testStore = new TestStore({
//       inkwell: jasmineHeirOfAgrabah.cost,
//       hand: [jasmineHeirOfAgrabah],
//       play: [donaldDuckMusketeer],
//     });
//
//     const cardUnderTest = testStore.getCard(jasmineHeirOfAgrabah);
//     const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);
//
//     target.updateCardMeta({ damage: 2 });
//
//     cardUnderTest.playFromHand();
//
//     testStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     expect(cardUnderTest.zone).toEqual("play");
//     expect(target.meta.damage).toEqual(1);
//   });
// });
//
// describe("Regression", () => {
//   it("Should not get people stuck when playing alone", async () => {
//     const testEngine = new TestEngine({
//       inkwell: jasmineHeirOfAgrabah.cost,
//       hand: [jasmineHeirOfAgrabah],
//     });
//
//     await testEngine.playCard(jasmineHeirOfAgrabah);
//
//     expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
