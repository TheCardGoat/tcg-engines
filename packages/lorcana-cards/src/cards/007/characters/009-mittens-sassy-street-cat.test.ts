// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CaptainHookForcefulDuelist,
//   HadesInfernalSchemer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { fishboneQuill } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { letItGo } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { plutoGuardDog } from "@lorcanito/lorcana-engine/cards/006";
// Import { mittensSassyStreetCat } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mittens - Sassy Street Cat", () => {
//   It("Bodyguard", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mittensSassyStreetCat],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mittensSassyStreetCat);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   Describe("NO THANKS NECESSARY", () => {
//     It("Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 5,
//           Play: [
//             MittensSassyStreetCat,
//             PlutoGuardDog,
//             CaptainHookForcefulDuelist,
//           ],
//           Hand: [mrSmeeBumblingMate],
//         },
//         {
//           Inkwell: 5,
//           Play: [],
//           Hand: [letItGo],
//           Deck: [hadesInfernalSchemer],
//         },
//       );
//
//       Expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
//
//       Await testEngine.putIntoInkwell(mrSmeeBumblingMate);
//
//       Expect(testEngine.getZonesCardCount().inkwell).toBe(6);
//       Expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(2);
//
//       // This character should not get +1 {L} because it doesn't have Bodyguard
//       Expect(testEngine.getCardModel(captainHookForcefulDuelist).lore).toBe(1);
//
//       Await testEngine.passTurn();
//
//       // Falls off after turn passed
//       Expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
//     });
//
//     It("Checking once during your turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 5,
//           Play: [
//             MittensSassyStreetCat,
//             PlutoGuardDog,
//             CaptainHookForcefulDuelist,
//             FishboneQuill,
//           ],
//           Hand: [mrSmeeBumblingMate, hiramFlavershamToymaker],
//         },
//         {
//           Inkwell: 5,
//           Play: [],
//           Hand: [letItGo],
//           Deck: [hadesInfernalSchemer],
//         },
//       );
//
//       Expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
//
//       Await testEngine.putIntoInkwell(mrSmeeBumblingMate);
//
//       Await testEngine.activateCard(fishboneQuill);
//
//       Await testEngine.resolveTopOfStack({
//         Targets: [hiramFlavershamToymaker],
//       });
//
//       Expect(testEngine.getZonesCardCount().inkwell).toBe(7);
//
//       // should only be 2, not 3 because the second ink should not trigger the effect
//       Expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(2);
//
//       // This character should not get +1 {L} because it doesn't have Bodyguard
//       Expect(testEngine.getCardModel(captainHookForcefulDuelist).lore).toBe(1);
//
//       Await testEngine.passTurn();
//
//       // Falls off after turn passed
//       Expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
//     });
//
//     It("Not your turn, doesn't trigger", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 5,
//           Play: [mittensSassyStreetCat, plutoGuardDog, mrSmeeBumblingMate],
//           Hand: [],
//         },
//         {
//           Inkwell: 5,
//           Play: [],
//           Hand: [letItGo],
//           Deck: [hadesInfernalSchemer],
//         },
//       );
//
//       Expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
//
//       Await testEngine.passTurn();
//
//       TestEngine.playCard(letItGo);
//
//       Await testEngine.resolveTopOfStack({ targets: [mrSmeeBumblingMate] });
//
//       Expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
//     });
//   });
// });
//
