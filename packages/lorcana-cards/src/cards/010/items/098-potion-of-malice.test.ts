// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/012-mickey-mouse-true-friend";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { potionOfMalice } from "./098-potion-of-malice";
//
// Describe("Potion Of Malice", () => {
//   Describe("SUPPRESSED ANGER - {E}, 1 {I} – Put 1 damage counter on chosen character", () => {
//     It("puts 1 damage counter on chosen character when activated", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: potionOfMalice.cost + 1,
//           Play: [potionOfMalice],
//         },
//         {
//           Play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       Const potion = testEngine.getCardModel(potionOfMalice);
//       Const target = testEngine.testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//         "player_two",
//       );
//
//       Expect(target.damage).toBe(0);
//
//       // Activate SUPPRESSED ANGER ability
//       Await testEngine.activateCard(potion, {
//         Ability: "Suppressed Anger",
//         Targets: [target],
//       });
//
//       Expect(target.damage).toBe(1);
//       Expect(potion.ready).toBe(false);
//     });
//
//     It("can target any character in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: potionOfMalice.cost + 1,
//         Play: [potionOfMalice, mickeyMouseTrueFriend],
//       });
//
//       Const potion = testEngine.getCardModel(potionOfMalice);
//       Const target = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       Expect(target.damage).toBe(0);
//
//       // Can target own character
//       Await testEngine.activateCard(potion, {
//         Ability: "Suppressed Anger",
//         Targets: [target],
//       });
//
//       Expect(target.damage).toBe(1);
//     });
//   });
//
//   Describe("MINDLESS RAGE - {E}, Banish this item – Each opposing damaged character gains Reckless until the start of your next turn", () => {
//     It("grants Reckless to all opposing damaged characters until start of next turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: potionOfMalice.cost,
//           Play: [potionOfMalice],
//         },
//         {
//           Play: [
//             MickeyMouseTrueFriend,
//             MickeyMouseTrueFriend,
//             MickeyMouseTrueFriend,
//           ],
//         },
//       );
//
//       Const potion = testEngine.getCardModel(potionOfMalice);
//       Const opponentCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_two",
//         "play",
//       );
//       Const damagedChar1 = opponentCards[0]!;
//       Const damagedChar2 = opponentCards[1]!;
//       Const undamagedChar = opponentCards[2]!;
//
//       // Manually damage two opposing characters
//       Await testEngine.setCardDamage(damagedChar1, 1);
//       Await testEngine.setCardDamage(damagedChar2, 2);
//
//       Expect(damagedChar1.hasReckless).toBe(false);
//       Expect(damagedChar2.hasReckless).toBe(false);
//       Expect(undamagedChar.hasReckless).toBe(false);
//
//       // Activate MINDLESS RAGE ability
//       Await testEngine.activateCard(potion, {
//         Ability: "Mindless Rage",
//       });
//
//       // Damaged opposing characters should have Reckless
//       Expect(damagedChar1.hasReckless).toBe(true);
//       Expect(damagedChar2.hasReckless).toBe(true);
//       // Undamaged character should not have Reckless
//       Expect(undamagedChar.hasReckless).toBe(false);
//       // Potion should be banished
//       Expect(potion.zone).toBe("discard");
//
//       // Pass turn to opponent
//       Await testEngine.passTurn();
//
//       // At start of player one's next turn, Reckless should be removed
//       Await testEngine.passTurn();
//
//       Expect(damagedChar1.hasReckless).toBe(false);
//       Expect(damagedChar2.hasReckless).toBe(false);
//     });
//
//     It("does not grant Reckless to own damaged characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: potionOfMalice.cost,
//           Play: [potionOfMalice, mickeyMouseTrueFriend],
//         },
//         {
//           Play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       Const potion = testEngine.getCardModel(potionOfMalice);
//       Const ownChar = testEngine.testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//         "player_one",
//       );
//       Const opponentChar = testEngine.testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//         "player_two",
//       );
//
//       // Damage both characters
//       Await testEngine.setCardDamage(ownChar, 1);
//       Await testEngine.setCardDamage(opponentChar, 1);
//
//       // Activate MINDLESS RAGE
//       Await testEngine.activateCard(potion, {
//         Ability: "Mindless Rage",
//       });
//
//       // Only opponent's damaged character should have Reckless
//       Expect(ownChar.hasReckless).toBe(false);
//       Expect(opponentChar.hasReckless).toBe(true);
//     });
//
//     It("does not affect characters if no opposing characters are damaged", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: potionOfMalice.cost,
//           Play: [potionOfMalice],
//         },
//         {
//           Play: [mickeyMouseTrueFriend, mickeyMouseTrueFriend],
//         },
//       );
//
//       Const potion = testEngine.getCardModel(potionOfMalice);
//       Const opponentCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_two",
//         "play",
//       );
//       Const char1 = opponentCards[0]!;
//       Const char2 = opponentCards[1]!;
//
//       // No damage on any character
//       Expect(char1.damage).toBe(0);
//       Expect(char2.damage).toBe(0);
//
//       // Activate MINDLESS RAGE
//       Await testEngine.activateCard(potion, {
//         Ability: "Mindless Rage",
//       });
//
//       // No characters should have Reckless
//       Expect(char1.hasReckless).toBe(false);
//       Expect(char2.hasReckless).toBe(false);
//       Expect(potion.zone).toBe("discard");
//     });
//   });
// });
//
