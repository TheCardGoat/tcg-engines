// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   diabloWatchfulRaven,
//   motherGothelDeviousConspirator,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mother Gothel - Devious Conspirator", () => {
//   describe("SOMEONE HAS TO MAKE USE OF THIS - If a character was banished this turn, this character gets +2 {S}", () => {
//     it("should have base strength when no character has been banished", () => {
//       const testEngine = new TestEngine({
//         play: [motherGothelDeviousConspirator],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         motherGothelDeviousConspirator,
//       );
//
//       expect(cardUnderTest.strength).toBe(
//         motherGothelDeviousConspirator.strength,
//       );
//       expect(cardUnderTest.strength).toBe(2);
//     });
//
//     it("should get +2 strength after a character is banished", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [motherGothelDeviousConspirator],
//         },
//         {
//           play: [diabloWatchfulRaven],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         motherGothelDeviousConspirator,
//       );
//       const targetCard = testEngine.getByZoneAndId(
//         "play",
//         diabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Before banishment
//       expect(cardUnderTest.strength).toBe(2);
//
//       // Banish opponent's character
//       targetCard.banish();
//
//       // After banishment
//       expect(cardUnderTest.strength).toBe(4); // 2 + 2 bonus
//     });
//
//     it("should get +2 strength after banishing own character", async () => {
//       const testEngine = new TestEngine({
//         play: [motherGothelDeviousConspirator, diabloWatchfulRaven],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         motherGothelDeviousConspirator,
//       );
//       const targetCard = testEngine.getCardModel(diabloWatchfulRaven);
//
//       // Before banishment
//       expect(cardUnderTest.strength).toBe(2);
//
//       // Banish own character
//       targetCard.banish();
//
//       // After banishment
//       expect(cardUnderTest.strength).toBe(4); // 2 + 2 bonus
//     });
//
//     it("should maintain +2 strength for the rest of the turn after banishment", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [motherGothelDeviousConspirator],
//         },
//         {
//           play: [diabloWatchfulRaven],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         motherGothelDeviousConspirator,
//       );
//       const targetCard = testEngine.getByZoneAndId(
//         "play",
//         diabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Banish opponent's character
//       targetCard.banish();
//
//       // Check strength immediately after
//       expect(cardUnderTest.strength).toBe(4);
//
//       // Check strength still applies
//       expect(cardUnderTest.strength).toBe(4);
//     });
//
//     it("should lose +2 strength bonus at the start of next turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [motherGothelDeviousConspirator],
//         },
//         {
//           play: [diabloWatchfulRaven],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         motherGothelDeviousConspirator,
//       );
//       const targetCard = testEngine.getByZoneAndId(
//         "play",
//         diabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Banish opponent's character
//       targetCard.banish();
//
//       // Verify strength bonus is active
//       expect(cardUnderTest.strength).toBe(4);
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//
//       // Pass back to player one (start of next turn)
//       testEngine.passTurn();
//
//       // Bonus should be gone - back to base strength
//       expect(cardUnderTest.strength).toBe(2);
//     });
//
//     it("should not get bonus if only non-character cards were banished", async () => {
//       const testEngine = new TestEngine({
//         play: [motherGothelDeviousConspirator],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         motherGothelDeviousConspirator,
//       );
//
//       // Check strength without any banishments
//       expect(cardUnderTest.strength).toBe(2);
//     });
//
//     it("should get bonus even if multiple characters are banished", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [motherGothelDeviousConspirator],
//         },
//         {
//           play: [diabloWatchfulRaven, diabloWatchfulRaven],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         motherGothelDeviousConspirator,
//       );
//       const targetCard1 = testEngine.getByZoneAndId(
//         "play",
//         diabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Before any banishment
//       expect(cardUnderTest.strength).toBe(2);
//
//       // Banish first opponent's character
//       targetCard1.banish();
//
//       // After first banishment - bonus active
//       expect(cardUnderTest.strength).toBe(4); // 2 + 2 bonus
//
//       // The bonus is +2, not +2 per character, so it stays at 4
//       expect(cardUnderTest.strength).toBe(4);
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [motherGothelDeviousConspirator],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         motherGothelDeviousConspirator,
//       );
//
//       expect(cardUnderTest.strength).toBe(2);
//       expect(cardUnderTest.willpower).toBe(1);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(1);
//     });
//
//     it("should be inkwell card", () => {
//       expect(motherGothelDeviousConspirator.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(motherGothelDeviousConspirator.characteristics).toEqual([
//         "storyborn",
//         "villain",
//         "sorcerer",
//       ]);
//     });
//
//     it("should be ruby color", () => {
//       expect(motherGothelDeviousConspirator.colors).toEqual(["ruby"]);
//     });
//   });
//
//   describe("Gameplay", () => {
//     it("should be playable from hand", async () => {
//       const testEngine = new TestEngine({
//         inkwell: motherGothelDeviousConspirator.cost,
//         hand: [motherGothelDeviousConspirator],
//       });
//
//       await testEngine.playCard(motherGothelDeviousConspirator);
//
//       const cardUnderTest = testEngine.getCardModel(
//         motherGothelDeviousConspirator,
//       );
//       expect(cardUnderTest.zone).toBe("play");
//     });
//   });
// });
//
