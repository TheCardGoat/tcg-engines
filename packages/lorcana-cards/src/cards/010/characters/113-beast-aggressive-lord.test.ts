// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BeastAggressiveLord,
//   GoliathGuardianOfCastleWyvern,
//   HermesHarriedMessenger,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Beast - Aggressive Lord", () => {
//   Describe("Boost 2 - Basic functionality", () => {
//     It("should have Boost ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [beastAggressiveLord],
//       });
//
//       Expect(testEngine.getCardModel(beastAggressiveLord).hasBoost).toBe(true);
//     });
//   });
//
//   Describe("THAT'S MINE - Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore", () => {
//     It("should have the THAT'S MINE ability defined", () => {
//       Const thatsMine = beastAggressiveLord.abilities?.find(
//         (a) => "name" in a && a.name === "THAT'S MINE",
//       );
//
//       Expect(thatsMine).toBeDefined();
//
//       If (
//         ThatsMine &&
//         "effects" in thatsMine &&
//         Array.isArray(thatsMine.effects)
//       ) {
//         // Should have 2 effects: opponent loses lore, you gain lore
//         Expect(thatsMine.effects).toHaveLength(2);
//
//         Const loseEffect = thatsMine.effects[0] as any;
//         Expect(loseEffect.type).toBe("lore");
//         Expect(loseEffect.modifier).toBe("subtract");
//         Expect(loseEffect.amount).toBe(1);
//
//         Const gainEffect = thatsMine.effects[1] as any;
//         Expect(gainEffect.type).toBe("lore");
//         Expect(gainEffect.modifier).toBe("add");
//         Expect(gainEffect.amount).toBe(1);
//       }
//     });
//
//     It.skip("should trigger when Beast challenges with a card under him", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: beastAggressiveLord.cost + 2,
//           Play: [beastAggressiveLord],
//           Deck: [hermesHarriedMessenger],
//         },
//         {
//           Play: [goliathGuardianOfCastleWyvern],
//         },
//       );
//
//       Const beast = testEngine.getCardModel(beastAggressiveLord);
//       Const defender = testEngine.getByZoneAndId(
//         "play",
//         GoliathGuardianOfCastleWyvern.id,
//         "player_two",
//       );
//
//       // Add card under Beast using boost ability
//       Await testEngine.activateCard(beastAggressiveLord);
//       Expect(beast.cardsUnder).toHaveLength(1);
//
//       Expect(testEngine.getPlayerLore("player_one")).toBe(0);
//       Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//
//       Await testEngine.tapCard(defender);
//       Await beast.challenge(defender);
//
//       Expect(testEngine.getPlayerLore("player_one")).toBe(1);
//       Expect(testEngine.getPlayerLore("player_two")).toBe(-1);
//     });
//
//     It("should NOT trigger when Beast challenges WITHOUT a card under him", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [beastAggressiveLord],
//         },
//         {
//           Play: [goliathGuardianOfCastleWyvern],
//         },
//       );
//
//       Const beast = testEngine.getCardModel(beastAggressiveLord);
//       Const defender = testEngine.getByZoneAndId(
//         "play",
//         GoliathGuardianOfCastleWyvern.id,
//         "player_two",
//       );
//
//       Expect(beast.cardsUnder).toHaveLength(0);
//       Expect(testEngine.getPlayerLore("player_one")).toBe(0);
//       Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//
//       Await testEngine.tapCard(defender);
//       Await beast.challenge(defender);
//
//       Expect(testEngine.getPlayerLore("player_one")).toBe(0);
//       Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//     });
//   });
// });
//
