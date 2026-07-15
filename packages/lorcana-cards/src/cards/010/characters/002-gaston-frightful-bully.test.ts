// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// // @ts-nocheck
// Import { describe, expect, it } from "@jest/globals";
// Import { gastonFrightfulBully } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// Import { chosenOpposingCharacterGainsMustQuestDuringNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe.skip("002-gaston-frightful-bully", () => {
//   It("should have correct metadata", () => {
//     Const gaston = gastonFrightfulBully;
//
//     Expect(gaston.name).toBe("Gaston");
//     Expect(gaston.title).toBe("Frightful Bully");
//     Expect(gaston.characteristics).toEqual(["storyborn", "villain", "whisper"]);
//     Expect(gaston.inkwell).toBe(false);
//     Expect(gaston.colors).toEqual(["amber"]);
//     Expect(gaston.cost).toBe(2);
//     Expect(gaston.strength).toBe(3);
//     Expect(gaston.willpower).toBe(3);
//     Expect(gaston.rarity).toBe("uncommon");
//     Expect(gaston.lore).toBe(1);
//   });
//
//   It("should have boost 2 ability", () => {
//     Const gaston = gastonFrightfulBully;
//
//     Expect(gaston.abilities).toHaveLength(2);
//
//     // Check boost ability
//     Const boostAbility = gaston.abilities.find(
//       (ability) => ability.type === "static" && ability.name === "Boost 2",
//     );
//     Expect(boostAbility).toBeDefined();
//   });
//
//   Describe("TOP THAT! ability", () => {
//     It("should trigger whenever this character quests", () => {
//       Const testEngine = new TestEngine();
//       Const [gaston, opponent] = testEngine.setup(
//         [
//           GastonFrightfulBully,
//           {
//             InstanceId: "opponent-1",
//             Type: "character",
//             Cost: 3,
//             Strength: 2,
//             Willpower: 3,
//           },
//         ],
//         2,
//       );
//
//       // Quest with Gaston to trigger ability
//       TestEngine.quest(gaston.instanceId);
//
//       // Check that opponent has challenge restriction
//       Const opponentCard = testEngine.player1.cards.find(
//         (c) => c.instanceId === opponent.instanceId,
//       );
//       Expect(opponentCard.hasChallengeRestriction).toBe(true);
//       Expect(opponentCard.canChallenge(gaston)).toBe(false);
//     });
//
//     It("should only trigger if there is a card under Gaston", () => {
//       Const testEngine = new TestEngine();
//       Const [gaston, opponent] = testEngine.setup(
//         [
//           GastonFrightfulBully,
//           {
//             InstanceId: "opponent-1",
//             Type: "character",
//             Cost: 3,
//             Strength: 2,
//             Willpower: 3,
//           },
//         ],
//         2,
//       );
//
//       // Quest with Gaston without a card under him (no cards in inkwell)
//       TestEngine.quest(gaston.instanceId);
//
//       // Opponent should not have must-quest
//       Const opponentCard = testEngine.player1.cards.find(
//         (c) => c.instanceId === opponent.instanceId,
//       );
//       Expect(opponentCard.hasMustQuest).toBe(false);
//
//       // Add card to Gaston's inkwell and quest again
//       TestEngine.addToInkwell(opponent.instanceId);
//       TestEngine.quest(gaston.instanceId);
//
//       // Now opponent should have must-quest
//       Expect(opponentCard.hasMustQuest).toBe(true);
//     });
//
//     It("should grant must-quest ability to opponent", () => {
//       Const testEngine = new TestEngine();
//       Const [gaston, opponent] = testEngine.setup(
//         [
//           GastonFrightfulBully,
//           {
//             InstanceId: "opponent-1",
//             Type: "character",
//             Cost: 3,
//             Strength: 2,
//             Willpower: 3,
//           },
//         ],
//         2,
//       );
//
//       // Add card to Gaston's inkwell and quest to trigger ability
//       TestEngine.addToInkwell(opponent.instanceId);
//       TestEngine.quest(gaston.instanceId);
//
//       // Check that opponent has must-quest and can't challenge
//       Const opponentCard = testEngine.player1.cards.find(
//         (c) => c.instanceId === opponent.instanceId,
//       );
//       Expect(opponentCard.hasMustQuest).toBe(true);
//       Expect(opponentCard.hasChallengeRestriction).toBe(true);
//       Expect(opponentCard.canChallenge(gaston)).toBe(false);
//     });
//
//     It("should prevent challenging with must-quest", () => {
//       Const testEngine = new TestEngine();
//       Const [gaston, opponent] = testEngine.setup(
//         [
//           GastonFrightfulBully,
//           {
//             InstanceId: "opponent-1",
//             Type: "character",
//             Cost: 3,
//             Strength: 2,
//             Willpower: 3,
//           },
//         ],
//         2,
//       );
//
//       // Add card to Gaston's inkwell and quest to trigger must-quest ability
//       TestEngine.addToInkwell(opponent.instanceId);
//       TestEngine.quest(gaston.instanceId);
//
//       // Check that opponent with must-quest cannot challenge
//       Const opponentCard = testEngine.player1.cards.find(
//         (c) => c.instanceId === opponent.instanceId,
//       );
//       Expect(opponentCard.hasMustQuest).toBe(true);
//       Expect(opponentCard.hasChallengeRestriction).toBe(true);
//       Expect(opponentCard.canChallenge(gaston)).toBe(false);
//     });
//
//     It("should not affect questing with must-quest ability", () => {
//       Const testEngine = new TestEngine();
//       Const [gaston, opponent] = testEngine.setup(
//         [
//           GastonFrightfulBully,
//           {
//             InstanceId: "opponent-1",
//             Type: "character",
//             Cost: 3,
//             Strength: 2,
//             Willpower: 3,
//           },
//         ],
//         2,
//       );
//
//       // Add card to Gaston's inkwell and quest to trigger ability
//       TestEngine.addToInkwell(opponent.instanceId);
//       TestEngine.quest(gaston.instanceId);
//
//       // Check that opponent has must-quest and can't challenge
//       Const opponentCard = testEngine.player1.cards.find(
//         (c) => c.instanceId === opponent.instanceId,
//       );
//       Expect(opponentCard.hasMustQuest).toBe(true);
//       Expect(opponentCard.hasChallengeRestriction).toBe(true);
//       Expect(opponentCard.canChallenge(gaston)).toBe(false);
//     });
//   });
// });
//
