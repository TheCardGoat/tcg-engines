import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { hermesHarriedMessenger } from "./112-hermes-harried-messenger";

describe("Hermes - Harried Messenger", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [hermesHarriedMessenger],
    });

    const cardUnderTest = testEngine.getCardModel(hermesHarriedMessenger);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { hermesHarriedMessenger } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Hermes - Harried Messenger", () => {
//   describe("Rush", () => {
//     it("should have Rush ability", () => {
//       const testEngine = new TestEngine({
//         play: [hermesHarriedMessenger],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(hermesHarriedMessenger);
//       expect(cardUnderTest.hasRush).toBe(true);
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [hermesHarriedMessenger],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(hermesHarriedMessenger);
//
//       expect(cardUnderTest.strength).toBe(3);
//       expect(cardUnderTest.willpower).toBe(3);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(3);
//     });
//
//     it("should be inkwell card", () => {
//       expect(hermesHarriedMessenger.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(hermesHarriedMessenger.characteristics).toEqual([
//         "storyborn",
//         "deity",
//       ]);
//     });
//
//     it("should be ruby color", () => {
//       expect(hermesHarriedMessenger.colors).toEqual(["ruby"]);
//     });
//   });
//
//   describe("Gameplay", () => {
//     it("should be playable from hand", async () => {
//       const testEngine = new TestEngine({
//         inkwell: hermesHarriedMessenger.cost,
//         hand: [hermesHarriedMessenger],
//       });
//
//       await testEngine.playCard(hermesHarriedMessenger);
//
//       const cardUnderTest = testEngine.getCardModel(hermesHarriedMessenger);
//       expect(cardUnderTest.zone).toBe("play");
//     });
//
//     it("should be able to challenge on the turn played due to Rush", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: hermesHarriedMessenger.cost,
//           hand: [hermesHarriedMessenger],
//         },
//         {
//           play: [moanaOfMotunui],
//         },
//       );
//
//       const opponentCard = testEngine.testStore.getByZoneAndId(
//         "play",
//         moanaOfMotunui.id,
//         "player_two",
//       );
//       opponentCard.updateCardMeta({ exerted: true });
//
//       await testEngine.playCard(hermesHarriedMessenger);
//
//       const cardUnderTest = testEngine.testStore.getByZoneAndId(
//         "play",
//         hermesHarriedMessenger.id,
//         "player_one",
//       );
//
//       // Verify Hermes was just played this turn
//       expect(cardUnderTest.meta.playedThisTurn).toBe(true);
//
//       // Verify Hermes has Rush
//       expect(cardUnderTest.hasRush).toBe(true);
//
//       // Execute the challenge
//       await testEngine.challenge({
//         attacker: cardUnderTest,
//         defender: opponentCard,
//       });
//
//       // Verify the challenge occurred
//       // Hermes (3 strength) dealt 3 damage to Moana (6 willpower)
//       // Moana (1 strength) dealt 1 damage to Hermes (3 willpower)
//       expect(cardUnderTest.meta.damage).toBe(1);
//       expect(opponentCard.meta.damage).toBe(3);
//       // Both characters survive
//       expect(cardUnderTest.zone).toBe("play");
//       expect(opponentCard.zone).toBe("play");
//     });
//
//     it("should not be able to quest on the turn played", async () => {
//       const testEngine = new TestEngine({
//         inkwell: hermesHarriedMessenger.cost,
//         hand: [hermesHarriedMessenger],
//       });
//
//       await testEngine.playCard(hermesHarriedMessenger);
//
//       const cardUnderTest = testEngine.getCardModel(hermesHarriedMessenger);
//
//       // Rush allows challenging, but not questing
//       expect(cardUnderTest.canQuest).toBe(false);
//     });
//   });
// });
//
