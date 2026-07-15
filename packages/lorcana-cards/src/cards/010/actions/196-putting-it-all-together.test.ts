// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ElsaSnowQueen,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   GoofyKnightForADay,
//   RobinHoodCapableFighter,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { puttingItAllTogether } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Putting It All Together", () => {
//   Describe("Primary functionality", () => {
//     It("applies challenge restriction to chosen opposing character and draws a card", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: puttingItAllTogether.cost,
//           Hand: [puttingItAllTogether],
//           Deck: 5,
//         },
//         {
//           Play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       Const initialDeckCount = testEngine.getZonesCardCount().deck;
//       Const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       // Verify initial state - no restriction
//       Expect(targetCard.hasChallengeRestriction).toBe(false);
//
//       // Play the action and target the opposing character
//       Await testEngine.playCard(puttingItAllTogether, {
//         Targets: [mickeyMouseTrueFriend],
//       });
//
//       // Verify the opposing character cannot challenge
//       Expect(targetCard.hasChallengeRestriction).toBe(true);
//
//       // Verify card was drawn (action card was discarded, but we drew 1 card)
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 1, // Drew 1 card, action was discarded
//           Deck: initialDeckCount - 1,
//           Discard: 1, // Action card in discard
//         }),
//       );
//     });
//
//     It("draws exactly one card when played", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: puttingItAllTogether.cost,
//           Hand: [puttingItAllTogether],
//           Deck: 10,
//         },
//         {
//           Play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       Const initialHandCount = testEngine.getZonesCardCount().hand;
//       Const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//       Await testEngine.playCard(puttingItAllTogether, {
//         Targets: [mickeyMouseTrueFriend],
//       });
//
//       // Should have 1 more card in hand than before (action discarded + 1 drawn)
//       Expect(testEngine.getZonesCardCount().hand).toBe(initialHandCount);
//       // Deck should have 1 fewer card
//       Expect(testEngine.getZonesCardCount().deck).toBe(initialDeckCount - 1);
//       // Action should be in discard
//       Expect(testEngine.getZonesCardCount().discard).toBe(1);
//     });
//
//     It("applies restriction to any opposing character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: puttingItAllTogether.cost,
//           Hand: [puttingItAllTogether],
//         },
//         {
//           Play: [elsaSnowQueen],
//         },
//       );
//
//       Const targetCard = testEngine.getCardModel(elsaSnowQueen);
//
//       Await testEngine.playCard(puttingItAllTogether, {
//         Targets: [elsaSnowQueen],
//       });
//
//       Expect(targetCard.hasChallengeRestriction).toBe(true);
//     });
//
//     It("can target opposing character using card model", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: puttingItAllTogether.cost,
//           Hand: [puttingItAllTogether],
//         },
//         {
//           Play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       Const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       Await testEngine.playCard(puttingItAllTogether, {
//         Targets: [targetCard],
//       });
//
//       Expect(targetCard.hasChallengeRestriction).toBe(true);
//     });
//   });
//
//   Describe("Challenge restriction duration", () => {
//     It("restriction persists during opponent's turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: puttingItAllTogether.cost,
//           Hand: [puttingItAllTogether],
//           Play: [goofyKnightForADay],
//         },
//         {
//           Play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       Const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       // Play the action
//       Await testEngine.playCard(puttingItAllTogether, {
//         Targets: [mickeyMouseTrueFriend],
//       });
//
//       Expect(targetCard.hasChallengeRestriction).toBe(true);
//
//       // Pass turn to opponent - restriction should still be active
//       Await testEngine.passTurn();
//       Expect(targetCard.hasChallengeRestriction).toBe(true);
//     });
//
//     It("restriction expires after opponent's turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: puttingItAllTogether.cost,
//           Hand: [puttingItAllTogether],
//           Play: [goofyKnightForADay],
//         },
//         {
//           Play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       Const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       // Play the action
//       Await testEngine.playCard(puttingItAllTogether, {
//         Targets: [mickeyMouseTrueFriend],
//       });
//
//       Expect(targetCard.hasChallengeRestriction).toBe(true);
//
//       // Pass turn to opponent
//       Await testEngine.passTurn();
//       Expect(targetCard.hasChallengeRestriction).toBe(true);
//
//       // Pass turn back - restriction should expire
//       Await testEngine.passTurn();
//       Expect(targetCard.hasChallengeRestriction).toBe(false);
//     });
//
//     It("only affects targeted character, not other opposing characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: puttingItAllTogether.cost,
//           Hand: [puttingItAllTogether],
//         },
//         {
//           Play: [mickeyMouseTrueFriend, elsaSnowQueen],
//         },
//       );
//
//       Const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//       Const otherCard = testEngine.getCardModel(elsaSnowQueen);
//
//       Await testEngine.playCard(puttingItAllTogether, {
//         Targets: [mickeyMouseTrueFriend],
//       });
//
//       // Only targeted character should have restriction
//       Expect(targetCard.hasChallengeRestriction).toBe(true);
//       Expect(otherCard.hasChallengeRestriction).toBe(false);
//     });
//   });
//
//   Describe("Edge cases", () => {
//     It("works when deck is empty (should not fail)", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: puttingItAllTogether.cost,
//           Hand: [puttingItAllTogether],
//           Deck: 0,
//         },
//         {
//           Play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       Const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       // Should not fail even with empty deck
//       Await testEngine.playCard(puttingItAllTogether, {
//         Targets: [mickeyMouseTrueFriend],
//       });
//
//       Expect(targetCard.hasChallengeRestriction).toBe(true);
//       // Action should be in discard
//       Expect(testEngine.getZonesCardCount().discard).toBe(1);
//     });
//
//     It("works with single card in deck", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: puttingItAllTogether.cost,
//           Hand: [puttingItAllTogether],
//           Deck: [robinHoodCapableFighter],
//         },
//         {
//           Play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       Const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       Await testEngine.playCard(puttingItAllTogether, {
//         Targets: [mickeyMouseTrueFriend],
//       });
//
//       Expect(targetCard.hasChallengeRestriction).toBe(true);
//       // Should have drawn the single card from deck
//       Expect(testEngine.getCardModel(robinHoodCapableFighter).zone).toBe(
//         "hand",
//       );
//     });
//   });
//
//   Describe("Card properties", () => {
//     It("has correct card characteristics", () => {
//       Expect(puttingItAllTogether.id).toBe("sva");
//       Expect(puttingItAllTogether.name).toBe("Putting It All Together");
//       Expect(puttingItAllTogether.type).toBe("action");
//       Expect(puttingItAllTogether.cost).toBe(2);
//       Expect(puttingItAllTogether.colors).toContain("steel");
//       Expect(puttingItAllTogether.inkwell).toBe(true);
//       Expect(puttingItAllTogether.characteristics).toContain("action");
//       Expect(puttingItAllTogether.set).toBe("010");
//       Expect(puttingItAllTogether.number).toBe(196);
//       Expect(puttingItAllTogether.rarity).toBe("common");
//     });
//
//     It("has correct ability configuration", () => {
//       Expect(puttingItAllTogether.abilities).toHaveLength(1);
//       Const ability = puttingItAllTogether.abilities[0];
//
//       If (!ability) {
//         Throw new Error("Ability should be defined");
//       }
//
//       Expect(ability.type).toBe("resolution");
//       Expect(ability.effects).toHaveLength(2);
//
//       // First effect: challenge restriction
//       Const restrictionEffect = ability.effects![0];
//       If (restrictionEffect && restrictionEffect.type === "restriction") {
//         Expect(restrictionEffect.restriction).toBe("challenge");
//         Expect(restrictionEffect.duration).toBe("next_turn");
//         Expect(restrictionEffect.target).toBeDefined();
//       } else {
//         Throw new Error("Expected restriction effect");
//       }
//
//       // Second effect: draw a card
//       Const drawEffect = ability.effects![1];
//       If (drawEffect && drawEffect.type === "draw") {
//         Expect(drawEffect.amount).toBe(1);
//       } else {
//         Throw new Error("Expected draw effect");
//       }
//     });
//   });
// });
//
