// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// import {
//   blessedBagpipes,
//   goliathGuardianOfCastleWyvern,
//   kristoffMiningTheRuins,
//   littleJohnImpermanentOutlaw,
//   megaraSecretKeeper,
//   simbaKingInTheMaking,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Blessed Bagpipes", () => {
//   it("MCDUCK HEIRLOOM - When you play this item, you may put the top card of your deck facedown under one of your characters or locations with Boost.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: blessedBagpipes.cost,
//       hand: [blessedBagpipes],
//       deck: 5,
//       play: [megaraSecretKeeper], // Has Boost 3 ability
//     });
//
//     const cardUnderTest = testEngine.getCardModel(blessedBagpipes);
//     const boostCharacter = testEngine.getCardModel(megaraSecretKeeper);
//
//     // Initially, Simba should have no cards under him
//     expect(boostCharacter.cardsUnder.length).toBe(0);
//
//     // Play Blessed Bagpipes
//     await testEngine.playCard(cardUnderTest);
//
//     // Accept the optional trigger
//     await testEngine.acceptOptionalLayer();
//
//     // Select Simba as the target to put the card under
//     await testEngine.resolveTopOfStack({ targets: [boostCharacter] }, true);
//
//     expect(boostCharacter.cardsUnder.length).toBe(1);
//     expect(cardUnderTest.zone).toBe("play");
//   });
//
//   describe("BATTLE ANTHEM - Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.", () => {
//     it("should gain 1 lore when a character with a card under them is challenged", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: kristoffMiningTheRuins.cost + 1,
//           play: [blessedBagpipes, kristoffMiningTheRuins],
//           deck: 5,
//           hand: [goofyKnightForADay],
//         },
//         {
//           play: [goliathGuardianOfCastleWyvern],
//         },
//       );
//
//       const targetCard = testEngine.getCardModel(kristoffMiningTheRuins);
//       await testEngine.activateCard(targetCard);
//       expect(targetCard.cardsUnder).toHaveLength(1);
//
//       expect(testEngine.getPlayerLore("player_one")).toBe(0);
//
//       await testEngine.passTurn();
//
//       await testEngine.challenge({
//         attacker: goliathGuardianOfCastleWyvern,
//         defender: targetCard,
//         exertDefender: true,
//       });
//
//       // TODO: Something is wrong here: The layer should be resolved automatically. AND
//       // The player gaining lore should be the active player.
//       // testEngine.changeActivePlayer("player_one");
//       testEngine.acceptOptionalLayer();
//
//       expect(testEngine.getPlayerLore("player_one")).toBe(1);
//     });
//
//     it("should NOT gain lore when a character WITHOUT a card under them is challenged", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [blessedBagpipes, megaraSecretKeeper],
//         },
//         {
//           play: [goliathGuardianOfCastleWyvern],
//         },
//       );
//
//       const megara = testEngine.getCardModel(megaraSecretKeeper);
//
//       // Megara has no cards under her
//       expect(megara.cardsUnder).toHaveLength(0);
//
//       expect(testEngine.getPlayerLore("player_one")).toBe(0);
//
//       await testEngine.passTurn();
//
//       // Challenge Megara
//       await testEngine.challenge({
//         attacker: goliathGuardianOfCastleWyvern,
//         defender: megaraSecretKeeper,
//         exertDefender: true,
//       });
//
//       // Should NOT gain lore (no card under Megara)
//       expect(testEngine.getPlayerLore("player_one")).toBe(0);
//     });
//   });
// });
//
