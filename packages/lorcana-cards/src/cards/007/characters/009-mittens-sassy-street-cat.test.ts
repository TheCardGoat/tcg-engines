// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   captainHookForcefulDuelist,
//   hadesInfernalSchemer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { fishboneQuill } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import { letItGo } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { plutoGuardDog } from "@lorcanito/lorcana-engine/cards/006";
// import { mittensSassyStreetCat } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mittens - Sassy Street Cat", () => {
//   it("Bodyguard", async () => {
//     const testEngine = new TestEngine({
//       play: [mittensSassyStreetCat],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(mittensSassyStreetCat);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   describe("NO THANKS NECESSARY", () => {
//     it("Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 5,
//           play: [
//             mittensSassyStreetCat,
//             plutoGuardDog,
//             captainHookForcefulDuelist,
//           ],
//           hand: [mrSmeeBumblingMate],
//         },
//         {
//           inkwell: 5,
//           play: [],
//           hand: [letItGo],
//           deck: [hadesInfernalSchemer],
//         },
//       );
//
//       expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
//
//       await testEngine.putIntoInkwell(mrSmeeBumblingMate);
//
//       expect(testEngine.getZonesCardCount().inkwell).toBe(6);
//       expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(2);
//
//       // This character should not get +1 {L} because it doesn't have Bodyguard
//       expect(testEngine.getCardModel(captainHookForcefulDuelist).lore).toBe(1);
//
//       await testEngine.passTurn();
//
//       // Falls off after turn passed
//       expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
//     });
//
//     it("Checking once during your turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 5,
//           play: [
//             mittensSassyStreetCat,
//             plutoGuardDog,
//             captainHookForcefulDuelist,
//             fishboneQuill,
//           ],
//           hand: [mrSmeeBumblingMate, hiramFlavershamToymaker],
//         },
//         {
//           inkwell: 5,
//           play: [],
//           hand: [letItGo],
//           deck: [hadesInfernalSchemer],
//         },
//       );
//
//       expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
//
//       await testEngine.putIntoInkwell(mrSmeeBumblingMate);
//
//       await testEngine.activateCard(fishboneQuill);
//
//       await testEngine.resolveTopOfStack({
//         targets: [hiramFlavershamToymaker],
//       });
//
//       expect(testEngine.getZonesCardCount().inkwell).toBe(7);
//
//       // should only be 2, not 3 because the second ink should not trigger the effect
//       expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(2);
//
//       // This character should not get +1 {L} because it doesn't have Bodyguard
//       expect(testEngine.getCardModel(captainHookForcefulDuelist).lore).toBe(1);
//
//       await testEngine.passTurn();
//
//       // Falls off after turn passed
//       expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
//     });
//
//     it("Not your turn, doesn't trigger", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 5,
//           play: [mittensSassyStreetCat, plutoGuardDog, mrSmeeBumblingMate],
//           hand: [],
//         },
//         {
//           inkwell: 5,
//           play: [],
//           hand: [letItGo],
//           deck: [hadesInfernalSchemer],
//         },
//       );
//
//       expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
//
//       await testEngine.passTurn();
//
//       testEngine.playCard(letItGo);
//
//       await testEngine.resolveTopOfStack({ targets: [mrSmeeBumblingMate] });
//
//       expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
//     });
//   });
// });
//
