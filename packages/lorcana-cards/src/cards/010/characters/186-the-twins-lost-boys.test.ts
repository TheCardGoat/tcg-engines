// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   donaldGhostHunter,
//   theTwinsLostBoys,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { zootopiaPoliceHeadquarters } from "@lorcanito/lorcana-engine/cards/010/locations/203-zootopia-police-headquarters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Twins - Lost Boys", () => {
//   describe("TWO FOR ONE", () => {
//     it("should deal 2 damage when you have a location in play", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: theTwinsLostBoys.cost,
//           hand: [theTwinsLostBoys],
//           play: [zootopiaPoliceHeadquarters],
//         },
//         {
//           play: [donaldGhostHunter],
//         },
//       );
//
//       const targetCharacter = testEngine.getByZoneAndId(
//         "play",
//         donaldGhostHunter.id,
//         "player_two",
//       );
//       const initialDamage = targetCharacter.damage;
//
//       await testEngine.playCard(theTwinsLostBoys);
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//       expect(targetCharacter.damage).toBe(initialDamage + 2);
//     });
//
//     it("should not trigger when you don't have a location in play", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: theTwinsLostBoys.cost,
//           hand: [theTwinsLostBoys],
//         },
//         {
//           play: [donaldGhostHunter],
//         },
//       );
//
//       await testEngine.playCard(theTwinsLostBoys);
//
//       // Since no location is in play, no optional layer should be added
//       expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//     });
//
//     it("should be optional", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: theTwinsLostBoys.cost,
//           hand: [theTwinsLostBoys],
//           play: [zootopiaPoliceHeadquarters],
//         },
//         {
//           play: [donaldGhostHunter],
//         },
//       );
//
//       const targetCharacter = testEngine.getByZoneAndId(
//         "play",
//         donaldGhostHunter.id,
//         "player_two",
//       );
//       const initialDamage = targetCharacter.damage;
//
//       await testEngine.playCard(theTwinsLostBoys);
//       await testEngine.skipTopOfStack();
//
//       expect(targetCharacter.damage).toBe(initialDamage);
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [theTwinsLostBoys],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(theTwinsLostBoys);
//
//       expect(cardUnderTest.strength).toBe(5);
//       expect(cardUnderTest.willpower).toBe(5);
//       expect(cardUnderTest.lore).toBe(2);
//       expect(cardUnderTest.cost).toBe(6);
//     });
//
//     it("should be inkwell card", () => {
//       expect(theTwinsLostBoys.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(theTwinsLostBoys.characteristics).toEqual(["storyborn", "ally"]);
//     });
//
//     it("should be steel color", () => {
//       expect(theTwinsLostBoys.colors).toEqual(["steel"]);
//     });
//
//     it("should be super rare rarity", () => {
//       expect(theTwinsLostBoys.rarity).toBe("super_rare");
//     });
//   });
// });
//
