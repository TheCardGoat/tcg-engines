// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// // @ts-nocheck
// import { describe, expect, it } from "@jest/globals";
// import { gastonFrightfulBully } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// import { chosenOpposingCharacterGainsMustQuestDuringNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe.skip("002-gaston-frightful-bully", () => {
//   it("should have correct metadata", () => {
//     const gaston = gastonFrightfulBully;
//
//     expect(gaston.name).toBe("Gaston");
//     expect(gaston.title).toBe("Frightful Bully");
//     expect(gaston.characteristics).toEqual(["storyborn", "villain", "whisper"]);
//     expect(gaston.inkwell).toBe(false);
//     expect(gaston.colors).toEqual(["amber"]);
//     expect(gaston.cost).toBe(2);
//     expect(gaston.strength).toBe(3);
//     expect(gaston.willpower).toBe(3);
//     expect(gaston.rarity).toBe("uncommon");
//     expect(gaston.lore).toBe(1);
//   });
//
//   it("should have boost 2 ability", () => {
//     const gaston = gastonFrightfulBully;
//
//     expect(gaston.abilities).toHaveLength(2);
//
//     // Check boost ability
//     const boostAbility = gaston.abilities.find(
//       (ability) => ability.type === "static" && ability.name === "Boost 2",
//     );
//     expect(boostAbility).toBeDefined();
//   });
//
//   describe("TOP THAT! ability", () => {
//     it("should trigger whenever this character quests", () => {
//       const testEngine = new TestEngine();
//       const [gaston, opponent] = testEngine.setup(
//         [
//           gastonFrightfulBully,
//           {
//             instanceId: "opponent-1",
//             type: "character",
//             cost: 3,
//             strength: 2,
//             willpower: 3,
//           },
//         ],
//         2,
//       );
//
//       // Quest with Gaston to trigger ability
//       testEngine.quest(gaston.instanceId);
//
//       // Check that opponent has challenge restriction
//       const opponentCard = testEngine.player1.cards.find(
//         (c) => c.instanceId === opponent.instanceId,
//       );
//       expect(opponentCard.hasChallengeRestriction).toBe(true);
//       expect(opponentCard.canChallenge(gaston)).toBe(false);
//     });
//
//     it("should only trigger if there is a card under Gaston", () => {
//       const testEngine = new TestEngine();
//       const [gaston, opponent] = testEngine.setup(
//         [
//           gastonFrightfulBully,
//           {
//             instanceId: "opponent-1",
//             type: "character",
//             cost: 3,
//             strength: 2,
//             willpower: 3,
//           },
//         ],
//         2,
//       );
//
//       // Quest with Gaston without a card under him (no cards in inkwell)
//       testEngine.quest(gaston.instanceId);
//
//       // Opponent should not have must-quest
//       const opponentCard = testEngine.player1.cards.find(
//         (c) => c.instanceId === opponent.instanceId,
//       );
//       expect(opponentCard.hasMustQuest).toBe(false);
//
//       // Add card to Gaston's inkwell and quest again
//       testEngine.addToInkwell(opponent.instanceId);
//       testEngine.quest(gaston.instanceId);
//
//       // Now opponent should have must-quest
//       expect(opponentCard.hasMustQuest).toBe(true);
//     });
//
//     it("should grant must-quest ability to opponent", () => {
//       const testEngine = new TestEngine();
//       const [gaston, opponent] = testEngine.setup(
//         [
//           gastonFrightfulBully,
//           {
//             instanceId: "opponent-1",
//             type: "character",
//             cost: 3,
//             strength: 2,
//             willpower: 3,
//           },
//         ],
//         2,
//       );
//
//       // Add card to Gaston's inkwell and quest to trigger ability
//       testEngine.addToInkwell(opponent.instanceId);
//       testEngine.quest(gaston.instanceId);
//
//       // Check that opponent has must-quest and can't challenge
//       const opponentCard = testEngine.player1.cards.find(
//         (c) => c.instanceId === opponent.instanceId,
//       );
//       expect(opponentCard.hasMustQuest).toBe(true);
//       expect(opponentCard.hasChallengeRestriction).toBe(true);
//       expect(opponentCard.canChallenge(gaston)).toBe(false);
//     });
//
//     it("should prevent challenging with must-quest", () => {
//       const testEngine = new TestEngine();
//       const [gaston, opponent] = testEngine.setup(
//         [
//           gastonFrightfulBully,
//           {
//             instanceId: "opponent-1",
//             type: "character",
//             cost: 3,
//             strength: 2,
//             willpower: 3,
//           },
//         ],
//         2,
//       );
//
//       // Add card to Gaston's inkwell and quest to trigger must-quest ability
//       testEngine.addToInkwell(opponent.instanceId);
//       testEngine.quest(gaston.instanceId);
//
//       // Check that opponent with must-quest cannot challenge
//       const opponentCard = testEngine.player1.cards.find(
//         (c) => c.instanceId === opponent.instanceId,
//       );
//       expect(opponentCard.hasMustQuest).toBe(true);
//       expect(opponentCard.hasChallengeRestriction).toBe(true);
//       expect(opponentCard.canChallenge(gaston)).toBe(false);
//     });
//
//     it("should not affect questing with must-quest ability", () => {
//       const testEngine = new TestEngine();
//       const [gaston, opponent] = testEngine.setup(
//         [
//           gastonFrightfulBully,
//           {
//             instanceId: "opponent-1",
//             type: "character",
//             cost: 3,
//             strength: 2,
//             willpower: 3,
//           },
//         ],
//         2,
//       );
//
//       // Add card to Gaston's inkwell and quest to trigger ability
//       testEngine.addToInkwell(opponent.instanceId);
//       testEngine.quest(gaston.instanceId);
//
//       // Check that opponent has must-quest and can't challenge
//       const opponentCard = testEngine.player1.cards.find(
//         (c) => c.instanceId === opponent.instanceId,
//       );
//       expect(opponentCard.hasMustQuest).toBe(true);
//       expect(opponentCard.hasChallengeRestriction).toBe(true);
//       expect(opponentCard.canChallenge(gaston)).toBe(false);
//     });
//   });
// });
//
