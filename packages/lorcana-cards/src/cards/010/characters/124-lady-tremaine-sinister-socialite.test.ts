// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fanTheFlames } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/027-hakuna-matata";
// Import { ladyTremaineSinisterSocialite } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lady Tremaine - Sinister Socialite", () => {
//   Describe("Boost ability", () => {
//     It("should have Boost 2 ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [ladyTremaineSinisterSocialite],
//       });
//
//       Expect(
//         TestEngine.getCardModel(ladyTremaineSinisterSocialite).hasBoost,
//       ).toBe(true);
//     });
//   });
//
//   Describe("EXPEDIENT SCHEMES - Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard", () => {
//     /**
//      * TEST CASE: Quest without boosting - no trigger
//      *
//      * SCENARIO: Quest without using Boost this turn
//      * EXPECTED: No trigger, normal quest
//      */
//     It("should not trigger when questing without boosting this turn", async () => {
//       Const testEngine = new TestEngine({
//         Play: [ladyTremaineSinisterSocialite],
//         Discard: [fanTheFlames],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         LadyTremaineSinisterSocialite,
//       );
//
//       // Make ready (simulate next turn after being played)
//       CardUnderTest.updateCardMeta({ exerted: false });
//
//       // Quest without having boosted
//       Await testEngine.questCard(cardUnderTest);
//
//       // Should just quest normally, no stack items
//       Expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//
//       // Fan the Flames should still be in discard
//       Const action = testEngine.getCardModel(fanTheFlames);
//       Expect(action.zone).toBe("discard");
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
//      *     Type: "ability-used-this-turn",
//      *     Ability: "Boost 2",  // Name of the ability
//      *     Source: "self",  // The card that used it
//      *   }
//      */
//     It("should trigger when questing after boosting this turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 10,
//         Deck: 3,
//         Play: [ladyTremaineSinisterSocialite],
//         Discard: [hakunaMatata], // Cost 3 action - eligible
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         LadyTremaineSinisterSocialite,
//       );
//       Const action = testEngine.getCardModel(hakunaMatata);
//
//       // Use boost
//       Await testEngine.activateCard(cardUnderTest, { ability: "Boost 2" });
//       Expect(cardUnderTest.cardsUnder.length).toBe(1);
//
//       // Quest - should trigger EXPEDIENT SCHEMES
//       Await testEngine.questCard(cardUnderTest);
//       Expect(testEngine.store.stackLayerStore.layers.length).toBeGreaterThan(0);
//
//       // Resolve - choose Hakuna Matata from discard
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [action] });
//
//       // Action should have been played (moved to play temporarily during resolution)
//       // Then moved to bottom of deck instead of discard
//       Expect(action.zone).toBe("deck");
//
//       // Verify it's at the bottom of the deck
//       Const deck = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       If (deck && deck.length > 0) {
//         Const bottomCard = deck[0];
//         If (bottomCard) {
//           Expect(bottomCard.instanceId).toBe(action.instanceId);
//         }
//       }
//     });
//   });
// });
//
