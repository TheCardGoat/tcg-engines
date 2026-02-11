// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// Import {
//   BlessedBagpipes,
//   GoliathGuardianOfCastleWyvern,
//   KristoffMiningTheRuins,
//   LittleJohnImpermanentOutlaw,
//   MegaraSecretKeeper,
//   SimbaKingInTheMaking,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Blessed Bagpipes", () => {
//   It("MCDUCK HEIRLOOM - When you play this item, you may put the top card of your deck facedown under one of your characters or locations with Boost.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: blessedBagpipes.cost,
//       Hand: [blessedBagpipes],
//       Deck: 5,
//       Play: [megaraSecretKeeper], // Has Boost 3 ability
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(blessedBagpipes);
//     Const boostCharacter = testEngine.getCardModel(megaraSecretKeeper);
//
//     // Initially, Simba should have no cards under him
//     Expect(boostCharacter.cardsUnder.length).toBe(0);
//
//     // Play Blessed Bagpipes
//     Await testEngine.playCard(cardUnderTest);
//
//     // Accept the optional trigger
//     Await testEngine.acceptOptionalLayer();
//
//     // Select Simba as the target to put the card under
//     Await testEngine.resolveTopOfStack({ targets: [boostCharacter] }, true);
//
//     Expect(boostCharacter.cardsUnder.length).toBe(1);
//     Expect(cardUnderTest.zone).toBe("play");
//   });
//
//   Describe("BATTLE ANTHEM - Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.", () => {
//     It("should gain 1 lore when a character with a card under them is challenged", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: kristoffMiningTheRuins.cost + 1,
//           Play: [blessedBagpipes, kristoffMiningTheRuins],
//           Deck: 5,
//           Hand: [goofyKnightForADay],
//         },
//         {
//           Play: [goliathGuardianOfCastleWyvern],
//         },
//       );
//
//       Const targetCard = testEngine.getCardModel(kristoffMiningTheRuins);
//       Await testEngine.activateCard(targetCard);
//       Expect(targetCard.cardsUnder).toHaveLength(1);
//
//       Expect(testEngine.getPlayerLore("player_one")).toBe(0);
//
//       Await testEngine.passTurn();
//
//       Await testEngine.challenge({
//         Attacker: goliathGuardianOfCastleWyvern,
//         Defender: targetCard,
//         ExertDefender: true,
//       });
//
//       // TODO: Something is wrong here: The layer should be resolved automatically. AND
//       // The player gaining lore should be the active player.
//       // testEngine.changeActivePlayer("player_one");
//       TestEngine.acceptOptionalLayer();
//
//       Expect(testEngine.getPlayerLore("player_one")).toBe(1);
//     });
//
//     It("should NOT gain lore when a character WITHOUT a card under them is challenged", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [blessedBagpipes, megaraSecretKeeper],
//         },
//         {
//           Play: [goliathGuardianOfCastleWyvern],
//         },
//       );
//
//       Const megara = testEngine.getCardModel(megaraSecretKeeper);
//
//       // Megara has no cards under her
//       Expect(megara.cardsUnder).toHaveLength(0);
//
//       Expect(testEngine.getPlayerLore("player_one")).toBe(0);
//
//       Await testEngine.passTurn();
//
//       // Challenge Megara
//       Await testEngine.challenge({
//         Attacker: goliathGuardianOfCastleWyvern,
//         Defender: megaraSecretKeeper,
//         ExertDefender: true,
//       });
//
//       // Should NOT gain lore (no card under Megara)
//       Expect(testEngine.getPlayerLore("player_one")).toBe(0);
//     });
//   });
// });
//
