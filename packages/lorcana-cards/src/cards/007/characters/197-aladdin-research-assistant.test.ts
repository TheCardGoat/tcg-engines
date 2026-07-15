// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   JafarKeeperOfSecrets,
//   JafarWicked,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { docBoldKnight } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { gopherShipsCarpenter } from "@lorcanito/lorcana-engine/cards/006";
// Import { aladdinResearchAssistant } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Aladdin - Research Assistant", () => {
//   Describe("HELPING HAND Whenever this character quests, you can play an Ally character with cost 3 or less for free.", () => {
//     It("should play an Ally character of cost 3 or less for free", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 7,
//         Play: [aladdinResearchAssistant],
//         Hand: [mrSmeeBumblingMate],
//       });
//
//       Await testEngine.questCard(aladdinResearchAssistant);
//       Await testEngine.playCard(mrSmeeBumblingMate);
//
//       Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(7);
//     });
//
//     It("should not play an Ally character of cost 3 or more for free", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 7,
//         Play: [aladdinResearchAssistant],
//         Hand: [gopherShipsCarpenter],
//       });
//
//       Await testEngine.questCard(aladdinResearchAssistant);
//       Await testEngine.playCard(gopherShipsCarpenter);
//
//       Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(3);
//     });
//
//     It("should not discount the cost of non-Ally characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 10,
//         Play: [aladdinResearchAssistant],
//         Hand: [jafarWicked, jafarKeeperOfSecrets],
//       });
//
//       Await testEngine.questCard(aladdinResearchAssistant);
//       Await testEngine.playCard(jafarWicked);
//
//       Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(6);
//
//       Await testEngine.playCard(jafarKeeperOfSecrets);
//
//       Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(2);
//     });
//   });
//
//   Describe("PUT IN THE EFFORT While this character exerted, your Ally characters gain +1 {S}.", () => {
//     It("should give +1 {S} only to Ally characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 10,
//         Play: [
//           AladdinResearchAssistant,
//           MrSmeeBumblingMate,
//           GopherShipsCarpenter,
//         ],
//         Hand: [],
//       });
//
//       TestEngine
//         .getCardModel(aladdinResearchAssistant)
//         .updateCardMeta({ exerted: true });
//       Expect(
//         TestEngine.getCardModel(aladdinResearchAssistant).meta.exerted,
//       ).toBeTruthy();
//
//       Expect(testEngine.getCardModel(mrSmeeBumblingMate).strength).toEqual(4);
//       Expect(testEngine.getCardModel(gopherShipsCarpenter).strength).toEqual(2);
//       Expect(
//         TestEngine.getCardModel(aladdinResearchAssistant).strength,
//       ).toEqual(aladdinResearchAssistant.strength);
//     });
//
//     It("should not give +1 {S} only to non-Ally characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 10,
//         Play: [aladdinResearchAssistant, jafarWicked, jafarKeeperOfSecrets],
//         Hand: [],
//       });
//
//       TestEngine
//         .getCardModel(aladdinResearchAssistant)
//         .updateCardMeta({ exerted: true });
//       Expect(
//         TestEngine.getCardModel(aladdinResearchAssistant).meta.exerted,
//       ).toBeTruthy();
//
//       Expect(testEngine.getCardModel(jafarWicked).strength).toEqual(2);
//       Expect(testEngine.getCardModel(jafarKeeperOfSecrets).strength).toEqual(0);
//       Expect(
//         TestEngine.getCardModel(aladdinResearchAssistant).strength,
//       ).toEqual(aladdinResearchAssistant.strength);
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("Should trigger 'whenever played' effects for played card", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 7,
//       Play: [aladdinResearchAssistant],
//       Hand: [docBoldKnight],
//     });
//
//     Await testEngine.questCard(aladdinResearchAssistant);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [docBoldKnight] }, true);
//
//     Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(7);
//     Expect(testEngine.getCardModel(docBoldKnight).zone).toBe("play");
//     Expect(testEngine.stackLayers).toHaveLength(1);
//     Expect(testEngine.stackLayers.at(0)?.name).toBe(
//       DocBoldKnight.abilities?.at(0)?.name,
//     );
//   });
// });
//
