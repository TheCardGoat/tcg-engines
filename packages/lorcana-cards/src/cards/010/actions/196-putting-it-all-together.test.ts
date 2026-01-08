// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   elsaSnowQueen,
//   mickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   goofyKnightForADay,
//   robinHoodCapableFighter,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { puttingItAllTogether } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Putting It All Together", () => {
//   describe("Primary functionality", () => {
//     it("applies challenge restriction to chosen opposing character and draws a card", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: puttingItAllTogether.cost,
//           hand: [puttingItAllTogether],
//           deck: 5,
//         },
//         {
//           play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       const initialDeckCount = testEngine.getZonesCardCount().deck;
//       const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       // Verify initial state - no restriction
//       expect(targetCard.hasChallengeRestriction).toBe(false);
//
//       // Play the action and target the opposing character
//       await testEngine.playCard(puttingItAllTogether, {
//         targets: [mickeyMouseTrueFriend],
//       });
//
//       // Verify the opposing character cannot challenge
//       expect(targetCard.hasChallengeRestriction).toBe(true);
//
//       // Verify card was drawn (action card was discarded, but we drew 1 card)
//       expect(testEngine.getZonesCardCount()).toEqual(
//         expect.objectContaining({
//           hand: 1, // Drew 1 card, action was discarded
//           deck: initialDeckCount - 1,
//           discard: 1, // Action card in discard
//         }),
//       );
//     });
//
//     it("draws exactly one card when played", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: puttingItAllTogether.cost,
//           hand: [puttingItAllTogether],
//           deck: 10,
//         },
//         {
//           play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       const initialHandCount = testEngine.getZonesCardCount().hand;
//       const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//       await testEngine.playCard(puttingItAllTogether, {
//         targets: [mickeyMouseTrueFriend],
//       });
//
//       // Should have 1 more card in hand than before (action discarded + 1 drawn)
//       expect(testEngine.getZonesCardCount().hand).toBe(initialHandCount);
//       // Deck should have 1 fewer card
//       expect(testEngine.getZonesCardCount().deck).toBe(initialDeckCount - 1);
//       // Action should be in discard
//       expect(testEngine.getZonesCardCount().discard).toBe(1);
//     });
//
//     it("applies restriction to any opposing character", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: puttingItAllTogether.cost,
//           hand: [puttingItAllTogether],
//         },
//         {
//           play: [elsaSnowQueen],
//         },
//       );
//
//       const targetCard = testEngine.getCardModel(elsaSnowQueen);
//
//       await testEngine.playCard(puttingItAllTogether, {
//         targets: [elsaSnowQueen],
//       });
//
//       expect(targetCard.hasChallengeRestriction).toBe(true);
//     });
//
//     it("can target opposing character using card model", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: puttingItAllTogether.cost,
//           hand: [puttingItAllTogether],
//         },
//         {
//           play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       await testEngine.playCard(puttingItAllTogether, {
//         targets: [targetCard],
//       });
//
//       expect(targetCard.hasChallengeRestriction).toBe(true);
//     });
//   });
//
//   describe("Challenge restriction duration", () => {
//     it("restriction persists during opponent's turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: puttingItAllTogether.cost,
//           hand: [puttingItAllTogether],
//           play: [goofyKnightForADay],
//         },
//         {
//           play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       // Play the action
//       await testEngine.playCard(puttingItAllTogether, {
//         targets: [mickeyMouseTrueFriend],
//       });
//
//       expect(targetCard.hasChallengeRestriction).toBe(true);
//
//       // Pass turn to opponent - restriction should still be active
//       await testEngine.passTurn();
//       expect(targetCard.hasChallengeRestriction).toBe(true);
//     });
//
//     it("restriction expires after opponent's turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: puttingItAllTogether.cost,
//           hand: [puttingItAllTogether],
//           play: [goofyKnightForADay],
//         },
//         {
//           play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       // Play the action
//       await testEngine.playCard(puttingItAllTogether, {
//         targets: [mickeyMouseTrueFriend],
//       });
//
//       expect(targetCard.hasChallengeRestriction).toBe(true);
//
//       // Pass turn to opponent
//       await testEngine.passTurn();
//       expect(targetCard.hasChallengeRestriction).toBe(true);
//
//       // Pass turn back - restriction should expire
//       await testEngine.passTurn();
//       expect(targetCard.hasChallengeRestriction).toBe(false);
//     });
//
//     it("only affects targeted character, not other opposing characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: puttingItAllTogether.cost,
//           hand: [puttingItAllTogether],
//         },
//         {
//           play: [mickeyMouseTrueFriend, elsaSnowQueen],
//         },
//       );
//
//       const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//       const otherCard = testEngine.getCardModel(elsaSnowQueen);
//
//       await testEngine.playCard(puttingItAllTogether, {
//         targets: [mickeyMouseTrueFriend],
//       });
//
//       // Only targeted character should have restriction
//       expect(targetCard.hasChallengeRestriction).toBe(true);
//       expect(otherCard.hasChallengeRestriction).toBe(false);
//     });
//   });
//
//   describe("Edge cases", () => {
//     it("works when deck is empty (should not fail)", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: puttingItAllTogether.cost,
//           hand: [puttingItAllTogether],
//           deck: 0,
//         },
//         {
//           play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       // Should not fail even with empty deck
//       await testEngine.playCard(puttingItAllTogether, {
//         targets: [mickeyMouseTrueFriend],
//       });
//
//       expect(targetCard.hasChallengeRestriction).toBe(true);
//       // Action should be in discard
//       expect(testEngine.getZonesCardCount().discard).toBe(1);
//     });
//
//     it("works with single card in deck", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: puttingItAllTogether.cost,
//           hand: [puttingItAllTogether],
//           deck: [robinHoodCapableFighter],
//         },
//         {
//           play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       const targetCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       await testEngine.playCard(puttingItAllTogether, {
//         targets: [mickeyMouseTrueFriend],
//       });
//
//       expect(targetCard.hasChallengeRestriction).toBe(true);
//       // Should have drawn the single card from deck
//       expect(testEngine.getCardModel(robinHoodCapableFighter).zone).toBe(
//         "hand",
//       );
//     });
//   });
//
//   describe("Card properties", () => {
//     it("has correct card characteristics", () => {
//       expect(puttingItAllTogether.id).toBe("sva");
//       expect(puttingItAllTogether.name).toBe("Putting It All Together");
//       expect(puttingItAllTogether.type).toBe("action");
//       expect(puttingItAllTogether.cost).toBe(2);
//       expect(puttingItAllTogether.colors).toContain("steel");
//       expect(puttingItAllTogether.inkwell).toBe(true);
//       expect(puttingItAllTogether.characteristics).toContain("action");
//       expect(puttingItAllTogether.set).toBe("010");
//       expect(puttingItAllTogether.number).toBe(196);
//       expect(puttingItAllTogether.rarity).toBe("common");
//     });
//
//     it("has correct ability configuration", () => {
//       expect(puttingItAllTogether.abilities).toHaveLength(1);
//       const ability = puttingItAllTogether.abilities[0];
//
//       if (!ability) {
//         throw new Error("Ability should be defined");
//       }
//
//       expect(ability.type).toBe("resolution");
//       expect(ability.effects).toHaveLength(2);
//
//       // First effect: challenge restriction
//       const restrictionEffect = ability.effects![0];
//       if (restrictionEffect && restrictionEffect.type === "restriction") {
//         expect(restrictionEffect.restriction).toBe("challenge");
//         expect(restrictionEffect.duration).toBe("next_turn");
//         expect(restrictionEffect.target).toBeDefined();
//       } else {
//         throw new Error("Expected restriction effect");
//       }
//
//       // Second effect: draw a card
//       const drawEffect = ability.effects![1];
//       if (drawEffect && drawEffect.type === "draw") {
//         expect(drawEffect.amount).toBe(1);
//       } else {
//         throw new Error("Expected draw effect");
//       }
//     });
//   });
// });
//
