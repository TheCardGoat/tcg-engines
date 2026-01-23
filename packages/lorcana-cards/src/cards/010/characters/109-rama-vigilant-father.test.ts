// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   balooFriendAndGuardian,
//   headlessManhorseManny, // cost 6 - should trigger
//   kaaHiddenSerpent,
//   ramaVigilantFather,
//   theHornedKingWickedRuler, // cost 4 - should not trigger
// } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Rama - Vigilant Father", () => {
//   describe("PROTECTION OF THE PACK", () => {
//     it("1. should trigger when you play another character with strength 5 or more", async () => {
//       const testEngine = new TestEngine({
//         play: [ramaVigilantFather],
//         hand: [headlessManhorseManny],
//         inkwell: headlessManhorseManny.cost,
//       });
//
//       const cardUnderTest = testEngine.getCardModel(ramaVigilantFather);
//       const cardInHand = testEngine.getCardModel(headlessManhorseManny);
//
//       // Quest with Rama to exert him
//       await testEngine.questCard(cardUnderTest);
//       expect(cardUnderTest.ready).toBe(false);
//
//       await testEngine.playCard(cardInHand, {}, true);
//
//       // Accept Bodyguard
//       await testEngine.acceptOptionalAbility();
//
//       expect(cardUnderTest.ready).toBe(true);
//       expect(cardUnderTest.canQuest).toBe(false);
//     });
//
//     it("2. should not trigger when you play another character with cost less than 5", async () => {
//       const testEngine = new TestEngine({
//         play: [ramaVigilantFather],
//         hand: [theHornedKingWickedRuler], // Cost 4
//         inkwell: theHornedKingWickedRuler.cost,
//       });
//
//       // Verify Rama's trigger should not fire for cost 4 character
//       await testEngine.playCard(theHornedKingWickedRuler);
//
//       // PROTECTION OF THE PACK should NOT trigger for cost 4
//       const protectionAbility = testEngine.store.stackLayerStore.layers.find(
//         (layer) => layer.ability.name === "PROTECTION OF THE PACK",
//       );
//       expect(protectionAbility).toBeUndefined();
//     });
//
//     it("3. should not trigger when you play Rama himself", async () => {
//       const testEngine = new TestEngine({
//         hand: [ramaVigilantFather],
//         inkwell: ramaVigilantFather.cost,
//       });
//
//       // Play Rama
//       await testEngine.playCard(ramaVigilantFather);
//
//       // Should not trigger his own ability when he's played
//       expect(testEngine.stackLayers).toHaveLength(0);
//     });
//
//     it("4. should ready Rama when you accept the optional ability", async () => {
//       const testEngine = new TestEngine({
//         play: [ramaVigilantFather],
//         hand: [headlessManhorseManny],
//         inkwell: headlessManhorseManny.cost,
//       });
//
//       const cardUnderTest = testEngine.getCardModel(ramaVigilantFather);
//
//       // Exert Rama
//       cardUnderTest.updateCardMeta({ exerted: true });
//       expect(cardUnderTest.ready).toBe(false);
//
//       await testEngine.playCard(headlessManhorseManny, {}, true);
//
//       // Accept Bodyguard
//       await testEngine.acceptOptionalAbility();
//
//       // Rama should be ready
//       expect(cardUnderTest.ready).toBe(true);
//     });
//
//     it("5. should prevent Rama from questing for the rest of the turn when readied", async () => {
//       const testEngine = new TestEngine({
//         play: [ramaVigilantFather],
//         hand: [kaaHiddenSerpent],
//         inkwell: kaaHiddenSerpent.cost,
//       });
//
//       // Play Rama first
//       await testEngine.tapCard(ramaVigilantFather);
//
//       // Play another character with cost 6
//       await testEngine.playCard(kaaHiddenSerpent);
//
//       // Accept optional ability
//       await testEngine.resolveOptionalAbility();
//
//       // Rama should be ready but unable to quest
//       expect(testEngine.getCardModel(ramaVigilantFather).meta.exerted).toBe(
//         false,
//       );
//       expect(testEngine.getCardModel(ramaVigilantFather).canQuest).toBe(false);
//     });
//   });
// });
//
