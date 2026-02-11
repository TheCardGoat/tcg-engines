// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BalooFriendAndGuardian,
//   HeadlessManhorseManny, // cost 6 - should trigger
//   KaaHiddenSerpent,
//   RamaVigilantFather,
//   TheHornedKingWickedRuler, // cost 4 - should not trigger
// } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rama - Vigilant Father", () => {
//   Describe("PROTECTION OF THE PACK", () => {
//     It("1. should trigger when you play another character with strength 5 or more", async () => {
//       Const testEngine = new TestEngine({
//         Play: [ramaVigilantFather],
//         Hand: [headlessManhorseManny],
//         Inkwell: headlessManhorseManny.cost,
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(ramaVigilantFather);
//       Const cardInHand = testEngine.getCardModel(headlessManhorseManny);
//
//       // Quest with Rama to exert him
//       Await testEngine.questCard(cardUnderTest);
//       Expect(cardUnderTest.ready).toBe(false);
//
//       Await testEngine.playCard(cardInHand, {}, true);
//
//       // Accept Bodyguard
//       Await testEngine.acceptOptionalAbility();
//
//       Expect(cardUnderTest.ready).toBe(true);
//       Expect(cardUnderTest.canQuest).toBe(false);
//     });
//
//     It("2. should not trigger when you play another character with cost less than 5", async () => {
//       Const testEngine = new TestEngine({
//         Play: [ramaVigilantFather],
//         Hand: [theHornedKingWickedRuler], // Cost 4
//         Inkwell: theHornedKingWickedRuler.cost,
//       });
//
//       // Verify Rama's trigger should not fire for cost 4 character
//       Await testEngine.playCard(theHornedKingWickedRuler);
//
//       // PROTECTION OF THE PACK should NOT trigger for cost 4
//       Const protectionAbility = testEngine.store.stackLayerStore.layers.find(
//         (layer) => layer.ability.name === "PROTECTION OF THE PACK",
//       );
//       Expect(protectionAbility).toBeUndefined();
//     });
//
//     It("3. should not trigger when you play Rama himself", async () => {
//       Const testEngine = new TestEngine({
//         Hand: [ramaVigilantFather],
//         Inkwell: ramaVigilantFather.cost,
//       });
//
//       // Play Rama
//       Await testEngine.playCard(ramaVigilantFather);
//
//       // Should not trigger his own ability when he's played
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//
//     It("4. should ready Rama when you accept the optional ability", async () => {
//       Const testEngine = new TestEngine({
//         Play: [ramaVigilantFather],
//         Hand: [headlessManhorseManny],
//         Inkwell: headlessManhorseManny.cost,
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(ramaVigilantFather);
//
//       // Exert Rama
//       CardUnderTest.updateCardMeta({ exerted: true });
//       Expect(cardUnderTest.ready).toBe(false);
//
//       Await testEngine.playCard(headlessManhorseManny, {}, true);
//
//       // Accept Bodyguard
//       Await testEngine.acceptOptionalAbility();
//
//       // Rama should be ready
//       Expect(cardUnderTest.ready).toBe(true);
//     });
//
//     It("5. should prevent Rama from questing for the rest of the turn when readied", async () => {
//       Const testEngine = new TestEngine({
//         Play: [ramaVigilantFather],
//         Hand: [kaaHiddenSerpent],
//         Inkwell: kaaHiddenSerpent.cost,
//       });
//
//       // Play Rama first
//       Await testEngine.tapCard(ramaVigilantFather);
//
//       // Play another character with cost 6
//       Await testEngine.playCard(kaaHiddenSerpent);
//
//       // Accept optional ability
//       Await testEngine.resolveOptionalAbility();
//
//       // Rama should be ready but unable to quest
//       Expect(testEngine.getCardModel(ramaVigilantFather).meta.exerted).toBe(
//         False,
//       );
//       Expect(testEngine.getCardModel(ramaVigilantFather).canQuest).toBe(false);
//     });
//   });
// });
//
