// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldGhostHunter,
//   TheTwinsLostBoys,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { zootopiaPoliceHeadquarters } from "@lorcanito/lorcana-engine/cards/010/locations/203-zootopia-police-headquarters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Twins - Lost Boys", () => {
//   Describe("TWO FOR ONE", () => {
//     It("should deal 2 damage when you have a location in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: theTwinsLostBoys.cost,
//           Hand: [theTwinsLostBoys],
//           Play: [zootopiaPoliceHeadquarters],
//         },
//         {
//           Play: [donaldGhostHunter],
//         },
//       );
//
//       Const targetCharacter = testEngine.getByZoneAndId(
//         "play",
//         DonaldGhostHunter.id,
//         "player_two",
//       );
//       Const initialDamage = targetCharacter.damage;
//
//       Await testEngine.playCard(theTwinsLostBoys);
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//       Expect(targetCharacter.damage).toBe(initialDamage + 2);
//     });
//
//     It("should not trigger when you don't have a location in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: theTwinsLostBoys.cost,
//           Hand: [theTwinsLostBoys],
//         },
//         {
//           Play: [donaldGhostHunter],
//         },
//       );
//
//       Await testEngine.playCard(theTwinsLostBoys);
//
//       // Since no location is in play, no optional layer should be added
//       Expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//     });
//
//     It("should be optional", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: theTwinsLostBoys.cost,
//           Hand: [theTwinsLostBoys],
//           Play: [zootopiaPoliceHeadquarters],
//         },
//         {
//           Play: [donaldGhostHunter],
//         },
//       );
//
//       Const targetCharacter = testEngine.getByZoneAndId(
//         "play",
//         DonaldGhostHunter.id,
//         "player_two",
//       );
//       Const initialDamage = targetCharacter.damage;
//
//       Await testEngine.playCard(theTwinsLostBoys);
//       Await testEngine.skipTopOfStack();
//
//       Expect(targetCharacter.damage).toBe(initialDamage);
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [theTwinsLostBoys],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(theTwinsLostBoys);
//
//       Expect(cardUnderTest.strength).toBe(5);
//       Expect(cardUnderTest.willpower).toBe(5);
//       Expect(cardUnderTest.lore).toBe(2);
//       Expect(cardUnderTest.cost).toBe(6);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(theTwinsLostBoys.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(theTwinsLostBoys.characteristics).toEqual(["storyborn", "ally"]);
//     });
//
//     It("should be steel color", () => {
//       Expect(theTwinsLostBoys.colors).toEqual(["steel"]);
//     });
//
//     It("should be super rare rarity", () => {
//       Expect(theTwinsLostBoys.rarity).toBe("super_rare");
//     });
//   });
// });
//
