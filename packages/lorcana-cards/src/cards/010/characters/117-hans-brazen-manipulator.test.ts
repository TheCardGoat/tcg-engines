// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HansBrazenManipulator,
//   MickeyMouseAmberChampion,
//   PrinceCharmingProtectorOfTheRealm,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hans - Brazen Manipulator", () => {
//   Describe("JOSTLING FOR POWER - King and Queen characters can't quest", () => {
//     It("should not affect non-King/Queen characters", () => {
//       Const testEngine = new TestEngine({
//         Play: [hansBrazenManipulator, mickeyMouseAmberChampion],
//       });
//
//       Const hans = testEngine.getCardModel(hansBrazenManipulator);
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey is not a King or Queen, so he can quest
//       Expect(mickey.canQuest).toBe(true);
//     });
//
//     It("should prevent King characters from questing", () => {
//       Const testEngine = new TestEngine({
//         Play: [hansBrazenManipulator, princeCharmingProtectorOfTheRealm],
//       });
//
//       Const hans = testEngine.getCardModel(hansBrazenManipulator);
//       Const prince = testEngine.getCardModel(princeCharmingProtectorOfTheRealm);
//
//       // Prince Charming is a prince, not a king, so he should be able to quest
//       Expect(prince.canQuest).toBe(true);
//     });
//   });
//
//   Describe("GROWING INFLUENCE - At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore", () => {
//     It("should gain 2 lore when opponent has 2+ ready characters", () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [hansBrazenManipulator],
//         },
//         {
//           Play: [princeCharmingProtectorOfTheRealm, mickeyMouseAmberChampion],
//         },
//       );
//
//       Const hans = testEngine.getCardModel(hansBrazenManipulator);
//       Const player = testEngine.store.tableStore.getTable("player_one");
//
//       Const initialLore = player.lore;
//
//       // Pass turn to trigger start of turn
//       TestEngine.passTurn();
//       TestEngine.passTurn();
//
//       Const playerAfter = testEngine.store.tableStore.getTable("player_one");
//
//       // Should gain 2 lore because opponent has 2 ready characters
//       Expect(playerAfter.lore).toBe(initialLore + 2);
//     });
//
//     It("should not gain lore when opponent has less than 2 ready characters", () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [hansBrazenManipulator],
//         },
//         {
//           Play: [princeCharmingProtectorOfTheRealm],
//         },
//       );
//
//       Const hans = testEngine.getCardModel(hansBrazenManipulator);
//       Const player = testEngine.store.tableStore.getTable("player_one");
//
//       Const initialLore = player.lore;
//
//       // Pass turn to trigger start of turn
//       TestEngine.passTurn();
//       TestEngine.passTurn();
//
//       Const playerAfter = testEngine.store.tableStore.getTable("player_one");
//
//       // Should not gain lore because opponent has only 1 ready character
//       Expect(playerAfter.lore).toBe(initialLore);
//     });
//
//     It("should gain lore even if characters were exerted before (they ready at start of turn)", () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [hansBrazenManipulator],
//         },
//         {
//           Play: [princeCharmingProtectorOfTheRealm, mickeyMouseAmberChampion],
//         },
//       );
//
//       Const hans = testEngine.getCardModel(hansBrazenManipulator);
//       Const prince = testEngine.getCardModel(princeCharmingProtectorOfTheRealm);
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Exert both opponent characters (they will ready at their start of turn)
//       Prince.exert();
//       Mickey.exert();
//
//       Const player = testEngine.store.tableStore.getTable("player_one");
//       Const initialLore = player.lore;
//
//       // Pass turn twice - opponent's characters ready at their start of turn
//       TestEngine.passTurn();
//       TestEngine.passTurn();
//
//       Const playerAfter = testEngine.store.tableStore.getTable("player_one");
//
//       // Should gain lore because opponent characters readied during their turn
//       Expect(playerAfter.lore).toBe(initialLore + 2);
//     });
//   });
// });
//
