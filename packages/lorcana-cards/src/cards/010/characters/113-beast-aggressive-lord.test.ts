// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   beastAggressiveLord,
//   goliathGuardianOfCastleWyvern,
//   hermesHarriedMessenger,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Beast - Aggressive Lord", () => {
//   describe("Boost 2 - Basic functionality", () => {
//     it("should have Boost ability", () => {
//       const testEngine = new TestEngine({
//         play: [beastAggressiveLord],
//       });
//
//       expect(testEngine.getCardModel(beastAggressiveLord).hasBoost).toBe(true);
//     });
//   });
//
//   describe("THAT'S MINE - Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore", () => {
//     it("should have the THAT'S MINE ability defined", () => {
//       const thatsMine = beastAggressiveLord.abilities?.find(
//         (a) => "name" in a && a.name === "THAT'S MINE",
//       );
//
//       expect(thatsMine).toBeDefined();
//
//       if (
//         thatsMine &&
//         "effects" in thatsMine &&
//         Array.isArray(thatsMine.effects)
//       ) {
//         // Should have 2 effects: opponent loses lore, you gain lore
//         expect(thatsMine.effects).toHaveLength(2);
//
//         const loseEffect = thatsMine.effects[0] as any;
//         expect(loseEffect.type).toBe("lore");
//         expect(loseEffect.modifier).toBe("subtract");
//         expect(loseEffect.amount).toBe(1);
//
//         const gainEffect = thatsMine.effects[1] as any;
//         expect(gainEffect.type).toBe("lore");
//         expect(gainEffect.modifier).toBe("add");
//         expect(gainEffect.amount).toBe(1);
//       }
//     });
//
//     it.skip("should trigger when Beast challenges with a card under him", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: beastAggressiveLord.cost + 2,
//           play: [beastAggressiveLord],
//           deck: [hermesHarriedMessenger],
//         },
//         {
//           play: [goliathGuardianOfCastleWyvern],
//         },
//       );
//
//       const beast = testEngine.getCardModel(beastAggressiveLord);
//       const defender = testEngine.getByZoneAndId(
//         "play",
//         goliathGuardianOfCastleWyvern.id,
//         "player_two",
//       );
//
//       // Add card under Beast using boost ability
//       await testEngine.activateCard(beastAggressiveLord);
//       expect(beast.cardsUnder).toHaveLength(1);
//
//       expect(testEngine.getPlayerLore("player_one")).toBe(0);
//       expect(testEngine.getPlayerLore("player_two")).toBe(0);
//
//       await testEngine.tapCard(defender);
//       await beast.challenge(defender);
//
//       expect(testEngine.getPlayerLore("player_one")).toBe(1);
//       expect(testEngine.getPlayerLore("player_two")).toBe(-1);
//     });
//
//     it("should NOT trigger when Beast challenges WITHOUT a card under him", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [beastAggressiveLord],
//         },
//         {
//           play: [goliathGuardianOfCastleWyvern],
//         },
//       );
//
//       const beast = testEngine.getCardModel(beastAggressiveLord);
//       const defender = testEngine.getByZoneAndId(
//         "play",
//         goliathGuardianOfCastleWyvern.id,
//         "player_two",
//       );
//
//       expect(beast.cardsUnder).toHaveLength(0);
//       expect(testEngine.getPlayerLore("player_one")).toBe(0);
//       expect(testEngine.getPlayerLore("player_two")).toBe(0);
//
//       await testEngine.tapCard(defender);
//       await beast.challenge(defender);
//
//       expect(testEngine.getPlayerLore("player_one")).toBe(0);
//       expect(testEngine.getPlayerLore("player_two")).toBe(0);
//     });
//   });
// });
//
