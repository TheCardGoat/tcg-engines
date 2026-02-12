// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielOnHumanLegs,
//   MauiHeroToAll,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { tinkerBellInsistentFairy } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tinker Bell - Insistent Fairy", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [tinkerBellInsistentFairy],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(tinkerBellInsistentFairy);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   Describe("PAY ATTENTION Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.", () => {
//     It("Valid target", () => {
//       Const testEngine = new TestEngine({
//         Lore: 0,
//         Inkwell: mauiHeroToAll.cost,
//         Hand: [mauiHeroToAll],
//         Play: [tinkerBellInsistentFairy],
//       });
//
//       Const targetCard = testEngine.getCardModel(mauiHeroToAll);
//
//       TargetCard.playFromHand();
//       TestEngine.acceptOptionalAbility();
//
//       Expect(targetCard.ready).toEqual(false);
//
//       // Expect the lore to be 2
//       Expect(testEngine.store.tableStore.getTable().lore).toEqual(2);
//       Expect(testEngine.store.tableStore.getTable().inkAvailable()).toEqual(0);
//       Expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     It("Invalid target", () => {
//       Const testEngine = new TestEngine({
//         Lore: 0,
//         Inkwell: arielOnHumanLegs.cost,
//         Hand: [arielOnHumanLegs],
//         Play: [tinkerBellInsistentFairy],
//       });
//
//       Const targetCard = testEngine.getCardModel(arielOnHumanLegs);
//
//       TargetCard.playFromHand();
//
//       Expect(targetCard.ready).toEqual(true);
//       Expect(testEngine.store.tableStore.getTable().lore).toEqual(0);
//     });
//
//     It("Skipping effects", () => {
//       Const testEngine = new TestEngine({
//         Lore: 0,
//         Inkwell: mauiHeroToAll.cost,
//         Hand: [mauiHeroToAll],
//         Play: [tinkerBellInsistentFairy],
//       });
//
//       Const targetCard = testEngine.getCardModel(mauiHeroToAll);
//
//       TargetCard.playFromHand();
//       TestEngine.skipTopOfStack();
//
//       Expect(targetCard.ready).toEqual(true);
//       Expect(testEngine.store.tableStore.getTable().lore).toEqual(0);
//     });
//   });
// });
//
// Describe("Regression tests for Tinker Bell - Insistent Fairy", () => {
//   It("Double Triggers should not gain double lore", async () => {
//     Const testEngine = new TestEngine({
//       Lore: 0,
//       Inkwell: mauiHeroToAll.cost,
//       Hand: [mauiHeroToAll],
//       Play: [tinkerBellInsistentFairy, tinkerBellInsistentFairy],
//     });
//
//     Const targetCard = testEngine.getCardModel(mauiHeroToAll);
//
//     Await targetCard.playFromHand();
//     Await testEngine.acceptOptionalAbility();
//
//     Expect(targetCard.ready).toEqual(false);
//
//     Expect(testEngine.store.tableStore.getTable().lore).toEqual(2);
//
//     Await testEngine.acceptOptionalAbility();
//     Expect(testEngine.store.tableStore.getTable().lore).toEqual(2);
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
