// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { fanTheFlames } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/027-hakuna-matata";
// import { ladyTremaineSinisterSocialite } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Lady Tremaine - Sinister Socialite", () => {
//   describe("Boost ability", () => {
//     it("should have Boost 2 ability", () => {
//       const testEngine = new TestEngine({
//         play: [ladyTremaineSinisterSocialite],
//       });
//
//       expect(
//         testEngine.getCardModel(ladyTremaineSinisterSocialite).hasBoost,
//       ).toBe(true);
//     });
//   });
//
//   describe("EXPEDIENT SCHEMES - Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard", () => {
//     /**
//      * TEST CASE: Quest without boosting - no trigger
//      *
//      * SCENARIO: Quest without using Boost this turn
//      * EXPECTED: No trigger, normal quest
//      */
//     it("should not trigger when questing without boosting this turn", async () => {
//       const testEngine = new TestEngine({
//         play: [ladyTremaineSinisterSocialite],
//         discard: [fanTheFlames],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         ladyTremaineSinisterSocialite,
//       );
//
//       // Make ready (simulate next turn after being played)
//       cardUnderTest.updateCardMeta({ exerted: false });
//
//       // Quest without having boosted
//       await testEngine.questCard(cardUnderTest);
//
//       // Should just quest normally, no stack items
//       expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//
//       // Fan the Flames should still be in discard
//       const action = testEngine.getCardModel(fanTheFlames);
//       expect(action.zone).toBe("discard");
//     });
//
//     /**
//      * TEST CASE: Boost then quest - trigger fires
//      *
//      * SCENARIO: Use Boost, then quest with Lady Tremaine
//      * EXPECTED: Trigger fires, can play action from discard for free
//      *
//      * ENGINE REQUIREMENT:
//      * - Need condition to check if specific ability was used this turn
//      * - Could use turn.abilities tracking: { card: instanceId, ability: "Boost 2" }
//      * - New condition type:
//      *   {
//      *     type: "ability-used-this-turn",
//      *     ability: "Boost 2",  // Name of the ability
//      *     source: "self",  // The card that used it
//      *   }
//      */
//     it("should trigger when questing after boosting this turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 10,
//         deck: 3,
//         play: [ladyTremaineSinisterSocialite],
//         discard: [hakunaMatata], // Cost 3 action - eligible
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         ladyTremaineSinisterSocialite,
//       );
//       const action = testEngine.getCardModel(hakunaMatata);
//
//       // Use boost
//       await testEngine.activateCard(cardUnderTest, { ability: "Boost 2" });
//       expect(cardUnderTest.cardsUnder.length).toBe(1);
//
//       // Quest - should trigger EXPEDIENT SCHEMES
//       await testEngine.questCard(cardUnderTest);
//       expect(testEngine.store.stackLayerStore.layers.length).toBeGreaterThan(0);
//
//       // Resolve - choose Hakuna Matata from discard
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({ targets: [action] });
//
//       // Action should have been played (moved to play temporarily during resolution)
//       // Then moved to bottom of deck instead of discard
//       expect(action.zone).toBe("deck");
//
//       // Verify it's at the bottom of the deck
//       const deck = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       if (deck && deck.length > 0) {
//         const bottomCard = deck[0];
//         if (bottomCard) {
//           expect(bottomCard.instanceId).toBe(action.instanceId);
//         }
//       }
//     });
//   });
// });
//
