// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { donaldDuckMusketeer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { jasmineHeirOfAgrabah } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jasmine - Heir of Agrabah", () => {
//   It("**I'M A FAST LEARNER** When you play this character, remove up to 1 damage from chosen character of yours.", () => {
//     Const testStore = new TestStore({
//       Inkwell: jasmineHeirOfAgrabah.cost,
//       Hand: [jasmineHeirOfAgrabah],
//       Play: [donaldDuckMusketeer],
//     });
//
//     Const cardUnderTest = testStore.getCard(jasmineHeirOfAgrabah);
//     Const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);
//
//     Target.updateCardMeta({ damage: 2 });
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(cardUnderTest.zone).toEqual("play");
//     Expect(target.meta.damage).toEqual(1);
//   });
// });
//
// Describe("Regression", () => {
//   It("Should not get people stuck when playing alone", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jasmineHeirOfAgrabah.cost,
//       Hand: [jasmineHeirOfAgrabah],
//     });
//
//     Await testEngine.playCard(jasmineHeirOfAgrabah);
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
