// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   MrSmeeBumblingMate,
//   RobinHoodChampionOfSherwood,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Robin Hood - Champion of Sherwood", () => {
//   Describe("**SKILLED COMBATANT** During your turn, whenever this character banishes another character in a challenge, gain 2 lore.", () => {
//     It("should gain 2 lore when banishes another character in a challenge during your turn", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [robinHoodChampionOfSherwood],
//         },
//         {
//           Play: [mrSmeeBumblingMate],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         RobinHoodChampionOfSherwood.id,
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         MrSmeeBumblingMate.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//       Attacker.challenge(defender);
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(2);
//       Expect(defender.zone).toEqual("discard");
//     });
//
//     It("should not gain 2 lore when banishes another character in a challenge during opponents turn", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [robinHoodChampionOfSherwood],
//         },
//         {
//           Play: [mrSmeeBumblingMate],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         MrSmeeBumblingMate.id,
//         "player_two",
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         RobinHoodChampionOfSherwood.id,
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//       Attacker.updateCardDamage(2, "add");
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//       Attacker.challenge(defender);
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//     });
//
//     It("should not trigger from its own banish during challenge", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [robinHoodChampionOfSherwood],
//         },
//         {
//           Play: [mrSmeeBumblingMate],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         RobinHoodChampionOfSherwood.id,
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         MrSmeeBumblingMate.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//       Attacker.challenge(defender);
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(2);
//     });
//   });
//
//   Describe("**THE GOOD OF OTHERS** When this character is banished in a challenge, you may draw a card.", () => {
//     It("When is banished in a challenge in your turn, you may draw a card.", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [robinHoodChampionOfSherwood],
//           Deck: 1,
//         },
//         {
//           Play: [mrSmeeBumblingMate],
//         },
//       );
//
//       Const attacker = testEngine.getCardModel(robinHoodChampionOfSherwood);
//       Const defender = testEngine.getCardModel(mrSmeeBumblingMate);
//
//       Attacker.updateCardDamage(3);
//       Defender.updateCardMeta({ exerted: true });
//       Await testEngine.challenge({ attacker, defender });
//
//       Expect(attacker.zone).toEqual("discard");
//
//       Await testEngine.resolveOptionalAbility();
//
//       Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//     });
//
//     It("When is banished in a challenge you may draw a card.", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [robinHoodChampionOfSherwood],
//           Deck: [mrSmeeBumblingMate],
//         },
//         {
//           Play: [goofyKnightForADay],
//         },
//       );
//
//       Const attacker = testStore.getCard(goofyKnightForADay);
//       Const defender = testStore.getCard(robinHoodChampionOfSherwood);
//
//       Defender.updateCardMeta({ exerted: true });
//       Attacker.challenge(defender);
//
//       Expect(attacker.zone).toEqual("play");
//       Expect(defender.zone).toEqual("discard");
//       TestStore.resolveOptionalAbility();
//       Expect(testStore.getZonesCardCount().hand).toEqual(1);
//     });
//   });
// });
//
