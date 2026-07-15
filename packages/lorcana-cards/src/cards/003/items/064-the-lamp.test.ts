// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AladdinStreetRat,
//   GenieOnTheJob,
//   HadesLordOfUnderworld,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { jafarDreadnought } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { theLamp } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { genieWishFulfilled } from "@lorcanito/lorcana-engine/cards/006";
// Import {
//   TobyDoggedCompanion,
//   TrampStreetSmartDog,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Lamp", () => {
//   Describe("**GOOD OR EVIL** Banish this item – If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.", () => {
//     It("should draw 2 cards if you have a character named Jafar in play", () => {
//       Const testStore = new TestStore({
//         Inkwell: theLamp.cost,
//         Play: [theLamp, jafarDreadnought],
//         Deck: 4,
//       });
//
//       Const cardUnderTest = testStore.getCard(theLamp);
//
//       CardUnderTest.activate();
//
//       Expect(cardUnderTest.zone).toBe("discard");
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 2,
//           Hand: 2,
//         }),
//       );
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It("should return a character with cost 4 or less to their player's hand if you have a character named Genie in play", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: theLamp.cost,
//           Play: [theLamp, genieOnTheJob],
//           Deck: 4,
//         },
//         {
//           Play: [hadesLordOfUnderworld],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(theLamp);
//       Const target = testStore.getCard(hadesLordOfUnderworld);
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(cardUnderTest.zone).toBe("discard");
//       Expect(target.zone).toBe("hand");
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 4,
//         }),
//       );
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It("should do both if you have both characters in play", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: theLamp.cost,
//           Play: [theLamp, genieOnTheJob, jafarDreadnought],
//           Deck: 4,
//         },
//         {
//           Play: [hadesLordOfUnderworld],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(theLamp);
//       Const target = testStore.getCard(hadesLordOfUnderworld);
//
//       CardUnderTest.activate();
//       Expect(cardUnderTest.zone).toBe("discard");
//
//       // Draws before deciding who to return
//       Expect(target.zone).toBe("play");
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 2,
//           Hand: 2,
//         }),
//       );
//
//       TestStore.resolveTopOfStack({ targets: [target] });
//       Expect(target.zone).toBe("hand");
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It("should do nothing if you don't have a character named Jafar or Genie in play", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: theLamp.cost,
//           Play: [theLamp, aladdinStreetRat],
//           Deck: 4,
//         },
//         {
//           Play: [hadesLordOfUnderworld],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(theLamp);
//       Const target = testStore.getCard(hadesLordOfUnderworld);
//
//       CardUnderTest.activate();
//       Expect(cardUnderTest.zone).toBe("discard");
//       Expect(testStore.stackLayers).toHaveLength(0);
//
//       Expect(target.zone).toBe("play");
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 4,
//         }),
//       );
//     });
//   });
// });
//
// Describe("The Lamp - Regression", () => {
//   It("Cost reduction should not be applied to the Lamp's effect", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [theLamp, genieWishFulfilled],
//       },
//       {
//         Play: [trampStreetSmartDog, hadesLordOfUnderworld, tobyDoggedCompanion],
//       },
//     );
//
//     Await testEngine.activateCard(
//       TheLamp,
//       { targets: [trampStreetSmartDog] },
//       True,
//     );
//
//     Expect(testEngine.getCardModel(trampStreetSmartDog).zone).toEqual("play");
//   });
// });
//
