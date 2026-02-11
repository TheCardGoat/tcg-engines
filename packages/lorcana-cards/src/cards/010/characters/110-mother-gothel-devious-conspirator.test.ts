// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DiabloWatchfulRaven,
//   MotherGothelDeviousConspirator,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mother Gothel - Devious Conspirator", () => {
//   Describe("SOMEONE HAS TO MAKE USE OF THIS - If a character was banished this turn, this character gets +2 {S}", () => {
//     It("should have base strength when no character has been banished", () => {
//       Const testEngine = new TestEngine({
//         Play: [motherGothelDeviousConspirator],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MotherGothelDeviousConspirator,
//       );
//
//       Expect(cardUnderTest.strength).toBe(
//         MotherGothelDeviousConspirator.strength,
//       );
//       Expect(cardUnderTest.strength).toBe(2);
//     });
//
//     It("should get +2 strength after a character is banished", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [motherGothelDeviousConspirator],
//         },
//         {
//           Play: [diabloWatchfulRaven],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MotherGothelDeviousConspirator,
//       );
//       Const targetCard = testEngine.getByZoneAndId(
//         "play",
//         DiabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Before banishment
//       Expect(cardUnderTest.strength).toBe(2);
//
//       // Banish opponent's character
//       TargetCard.banish();
//
//       // After banishment
//       Expect(cardUnderTest.strength).toBe(4); // 2 + 2 bonus
//     });
//
//     It("should get +2 strength after banishing own character", async () => {
//       Const testEngine = new TestEngine({
//         Play: [motherGothelDeviousConspirator, diabloWatchfulRaven],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MotherGothelDeviousConspirator,
//       );
//       Const targetCard = testEngine.getCardModel(diabloWatchfulRaven);
//
//       // Before banishment
//       Expect(cardUnderTest.strength).toBe(2);
//
//       // Banish own character
//       TargetCard.banish();
//
//       // After banishment
//       Expect(cardUnderTest.strength).toBe(4); // 2 + 2 bonus
//     });
//
//     It("should maintain +2 strength for the rest of the turn after banishment", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [motherGothelDeviousConspirator],
//         },
//         {
//           Play: [diabloWatchfulRaven],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MotherGothelDeviousConspirator,
//       );
//       Const targetCard = testEngine.getByZoneAndId(
//         "play",
//         DiabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Banish opponent's character
//       TargetCard.banish();
//
//       // Check strength immediately after
//       Expect(cardUnderTest.strength).toBe(4);
//
//       // Check strength still applies
//       Expect(cardUnderTest.strength).toBe(4);
//     });
//
//     It("should lose +2 strength bonus at the start of next turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [motherGothelDeviousConspirator],
//         },
//         {
//           Play: [diabloWatchfulRaven],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MotherGothelDeviousConspirator,
//       );
//       Const targetCard = testEngine.getByZoneAndId(
//         "play",
//         DiabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Banish opponent's character
//       TargetCard.banish();
//
//       // Verify strength bonus is active
//       Expect(cardUnderTest.strength).toBe(4);
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//
//       // Pass back to player one (start of next turn)
//       TestEngine.passTurn();
//
//       // Bonus should be gone - back to base strength
//       Expect(cardUnderTest.strength).toBe(2);
//     });
//
//     It("should not get bonus if only non-character cards were banished", async () => {
//       Const testEngine = new TestEngine({
//         Play: [motherGothelDeviousConspirator],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MotherGothelDeviousConspirator,
//       );
//
//       // Check strength without any banishments
//       Expect(cardUnderTest.strength).toBe(2);
//     });
//
//     It("should get bonus even if multiple characters are banished", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [motherGothelDeviousConspirator],
//         },
//         {
//           Play: [diabloWatchfulRaven, diabloWatchfulRaven],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MotherGothelDeviousConspirator,
//       );
//       Const targetCard1 = testEngine.getByZoneAndId(
//         "play",
//         DiabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Before any banishment
//       Expect(cardUnderTest.strength).toBe(2);
//
//       // Banish first opponent's character
//       TargetCard1.banish();
//
//       // After first banishment - bonus active
//       Expect(cardUnderTest.strength).toBe(4); // 2 + 2 bonus
//
//       // The bonus is +2, not +2 per character, so it stays at 4
//       Expect(cardUnderTest.strength).toBe(4);
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [motherGothelDeviousConspirator],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MotherGothelDeviousConspirator,
//       );
//
//       Expect(cardUnderTest.strength).toBe(2);
//       Expect(cardUnderTest.willpower).toBe(1);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(1);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(motherGothelDeviousConspirator.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(motherGothelDeviousConspirator.characteristics).toEqual([
//         "storyborn",
//         "villain",
//         "sorcerer",
//       ]);
//     });
//
//     It("should be ruby color", () => {
//       Expect(motherGothelDeviousConspirator.colors).toEqual(["ruby"]);
//     });
//   });
//
//   Describe("Gameplay", () => {
//     It("should be playable from hand", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: motherGothelDeviousConspirator.cost,
//         Hand: [motherGothelDeviousConspirator],
//       });
//
//       Await testEngine.playCard(motherGothelDeviousConspirator);
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MotherGothelDeviousConspirator,
//       );
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//   });
// });
//
