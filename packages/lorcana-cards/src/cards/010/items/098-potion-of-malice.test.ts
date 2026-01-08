// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/012-mickey-mouse-true-friend";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { potionOfMalice } from "./098-potion-of-malice";
//
// describe("Potion Of Malice", () => {
//   describe("SUPPRESSED ANGER - {E}, 1 {I} – Put 1 damage counter on chosen character", () => {
//     it("puts 1 damage counter on chosen character when activated", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: potionOfMalice.cost + 1,
//           play: [potionOfMalice],
//         },
//         {
//           play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       const potion = testEngine.getCardModel(potionOfMalice);
//       const target = testEngine.testStore.getByZoneAndId(
//         "play",
//         mickeyMouseTrueFriend.id,
//         "player_two",
//       );
//
//       expect(target.damage).toBe(0);
//
//       // Activate SUPPRESSED ANGER ability
//       await testEngine.activateCard(potion, {
//         ability: "Suppressed Anger",
//         targets: [target],
//       });
//
//       expect(target.damage).toBe(1);
//       expect(potion.ready).toBe(false);
//     });
//
//     it("can target any character in play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: potionOfMalice.cost + 1,
//         play: [potionOfMalice, mickeyMouseTrueFriend],
//       });
//
//       const potion = testEngine.getCardModel(potionOfMalice);
//       const target = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//       expect(target.damage).toBe(0);
//
//       // Can target own character
//       await testEngine.activateCard(potion, {
//         ability: "Suppressed Anger",
//         targets: [target],
//       });
//
//       expect(target.damage).toBe(1);
//     });
//   });
//
//   describe("MINDLESS RAGE - {E}, Banish this item – Each opposing damaged character gains Reckless until the start of your next turn", () => {
//     it("grants Reckless to all opposing damaged characters until start of next turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: potionOfMalice.cost,
//           play: [potionOfMalice],
//         },
//         {
//           play: [
//             mickeyMouseTrueFriend,
//             mickeyMouseTrueFriend,
//             mickeyMouseTrueFriend,
//           ],
//         },
//       );
//
//       const potion = testEngine.getCardModel(potionOfMalice);
//       const opponentCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_two",
//         "play",
//       );
//       const damagedChar1 = opponentCards[0]!;
//       const damagedChar2 = opponentCards[1]!;
//       const undamagedChar = opponentCards[2]!;
//
//       // Manually damage two opposing characters
//       await testEngine.setCardDamage(damagedChar1, 1);
//       await testEngine.setCardDamage(damagedChar2, 2);
//
//       expect(damagedChar1.hasReckless).toBe(false);
//       expect(damagedChar2.hasReckless).toBe(false);
//       expect(undamagedChar.hasReckless).toBe(false);
//
//       // Activate MINDLESS RAGE ability
//       await testEngine.activateCard(potion, {
//         ability: "Mindless Rage",
//       });
//
//       // Damaged opposing characters should have Reckless
//       expect(damagedChar1.hasReckless).toBe(true);
//       expect(damagedChar2.hasReckless).toBe(true);
//       // Undamaged character should not have Reckless
//       expect(undamagedChar.hasReckless).toBe(false);
//       // Potion should be banished
//       expect(potion.zone).toBe("discard");
//
//       // Pass turn to opponent
//       await testEngine.passTurn();
//
//       // At start of player one's next turn, Reckless should be removed
//       await testEngine.passTurn();
//
//       expect(damagedChar1.hasReckless).toBe(false);
//       expect(damagedChar2.hasReckless).toBe(false);
//     });
//
//     it("does not grant Reckless to own damaged characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: potionOfMalice.cost,
//           play: [potionOfMalice, mickeyMouseTrueFriend],
//         },
//         {
//           play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       const potion = testEngine.getCardModel(potionOfMalice);
//       const ownChar = testEngine.testStore.getByZoneAndId(
//         "play",
//         mickeyMouseTrueFriend.id,
//         "player_one",
//       );
//       const opponentChar = testEngine.testStore.getByZoneAndId(
//         "play",
//         mickeyMouseTrueFriend.id,
//         "player_two",
//       );
//
//       // Damage both characters
//       await testEngine.setCardDamage(ownChar, 1);
//       await testEngine.setCardDamage(opponentChar, 1);
//
//       // Activate MINDLESS RAGE
//       await testEngine.activateCard(potion, {
//         ability: "Mindless Rage",
//       });
//
//       // Only opponent's damaged character should have Reckless
//       expect(ownChar.hasReckless).toBe(false);
//       expect(opponentChar.hasReckless).toBe(true);
//     });
//
//     it("does not affect characters if no opposing characters are damaged", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: potionOfMalice.cost,
//           play: [potionOfMalice],
//         },
//         {
//           play: [mickeyMouseTrueFriend, mickeyMouseTrueFriend],
//         },
//       );
//
//       const potion = testEngine.getCardModel(potionOfMalice);
//       const opponentCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_two",
//         "play",
//       );
//       const char1 = opponentCards[0]!;
//       const char2 = opponentCards[1]!;
//
//       // No damage on any character
//       expect(char1.damage).toBe(0);
//       expect(char2.damage).toBe(0);
//
//       // Activate MINDLESS RAGE
//       await testEngine.activateCard(potion, {
//         ability: "Mindless Rage",
//       });
//
//       // No characters should have Reckless
//       expect(char1.hasReckless).toBe(false);
//       expect(char2.hasReckless).toBe(false);
//       expect(potion.zone).toBe("discard");
//     });
//   });
// });
//
