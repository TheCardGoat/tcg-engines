// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   jafarKeeperOfSecrets,
//   jafarWicked,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { docBoldKnight } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { gopherShipsCarpenter } from "@lorcanito/lorcana-engine/cards/006";
// import { aladdinResearchAssistant } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Aladdin - Research Assistant", () => {
//   describe("HELPING HAND Whenever this character quests, you can play an Ally character with cost 3 or less for free.", () => {
//     it("should play an Ally character of cost 3 or less for free", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 7,
//         play: [aladdinResearchAssistant],
//         hand: [mrSmeeBumblingMate],
//       });
//
//       await testEngine.questCard(aladdinResearchAssistant);
//       await testEngine.playCard(mrSmeeBumblingMate);
//
//       expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(7);
//     });
//
//     it("should not play an Ally character of cost 3 or more for free", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 7,
//         play: [aladdinResearchAssistant],
//         hand: [gopherShipsCarpenter],
//       });
//
//       await testEngine.questCard(aladdinResearchAssistant);
//       await testEngine.playCard(gopherShipsCarpenter);
//
//       expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(3);
//     });
//
//     it("should not discount the cost of non-Ally characters", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 10,
//         play: [aladdinResearchAssistant],
//         hand: [jafarWicked, jafarKeeperOfSecrets],
//       });
//
//       await testEngine.questCard(aladdinResearchAssistant);
//       await testEngine.playCard(jafarWicked);
//
//       expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(6);
//
//       await testEngine.playCard(jafarKeeperOfSecrets);
//
//       expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(2);
//     });
//   });
//
//   describe("PUT IN THE EFFORT While this character exerted, your Ally characters gain +1 {S}.", () => {
//     it("should give +1 {S} only to Ally characters", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 10,
//         play: [
//           aladdinResearchAssistant,
//           mrSmeeBumblingMate,
//           gopherShipsCarpenter,
//         ],
//         hand: [],
//       });
//
//       testEngine
//         .getCardModel(aladdinResearchAssistant)
//         .updateCardMeta({ exerted: true });
//       expect(
//         testEngine.getCardModel(aladdinResearchAssistant).meta.exerted,
//       ).toBeTruthy();
//
//       expect(testEngine.getCardModel(mrSmeeBumblingMate).strength).toEqual(4);
//       expect(testEngine.getCardModel(gopherShipsCarpenter).strength).toEqual(2);
//       expect(
//         testEngine.getCardModel(aladdinResearchAssistant).strength,
//       ).toEqual(aladdinResearchAssistant.strength);
//     });
//
//     it("should not give +1 {S} only to non-Ally characters", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 10,
//         play: [aladdinResearchAssistant, jafarWicked, jafarKeeperOfSecrets],
//         hand: [],
//       });
//
//       testEngine
//         .getCardModel(aladdinResearchAssistant)
//         .updateCardMeta({ exerted: true });
//       expect(
//         testEngine.getCardModel(aladdinResearchAssistant).meta.exerted,
//       ).toBeTruthy();
//
//       expect(testEngine.getCardModel(jafarWicked).strength).toEqual(2);
//       expect(testEngine.getCardModel(jafarKeeperOfSecrets).strength).toEqual(0);
//       expect(
//         testEngine.getCardModel(aladdinResearchAssistant).strength,
//       ).toEqual(aladdinResearchAssistant.strength);
//     });
//   });
// });
//
// describe("Regression", () => {
//   it("Should trigger 'whenever played' effects for played card", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 7,
//       play: [aladdinResearchAssistant],
//       hand: [docBoldKnight],
//     });
//
//     await testEngine.questCard(aladdinResearchAssistant);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [docBoldKnight] }, true);
//
//     expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(7);
//     expect(testEngine.getCardModel(docBoldKnight).zone).toBe("play");
//     expect(testEngine.stackLayers).toHaveLength(1);
//     expect(testEngine.stackLayers.at(0)?.name).toBe(
//       docBoldKnight.abilities?.at(0)?.name,
//     );
//   });
// });
//
