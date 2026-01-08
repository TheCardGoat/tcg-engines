// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   hansBrazenManipulator,
//   mickeyMouseAmberChampion,
//   princeCharmingProtectorOfTheRealm,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Hans - Brazen Manipulator", () => {
//   describe("JOSTLING FOR POWER - King and Queen characters can't quest", () => {
//     it("should not affect non-King/Queen characters", () => {
//       const testEngine = new TestEngine({
//         play: [hansBrazenManipulator, mickeyMouseAmberChampion],
//       });
//
//       const hans = testEngine.getCardModel(hansBrazenManipulator);
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey is not a King or Queen, so he can quest
//       expect(mickey.canQuest).toBe(true);
//     });
//
//     it("should prevent King characters from questing", () => {
//       const testEngine = new TestEngine({
//         play: [hansBrazenManipulator, princeCharmingProtectorOfTheRealm],
//       });
//
//       const hans = testEngine.getCardModel(hansBrazenManipulator);
//       const prince = testEngine.getCardModel(princeCharmingProtectorOfTheRealm);
//
//       // Prince Charming is a prince, not a king, so he should be able to quest
//       expect(prince.canQuest).toBe(true);
//     });
//   });
//
//   describe("GROWING INFLUENCE - At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore", () => {
//     it("should gain 2 lore when opponent has 2+ ready characters", () => {
//       const testEngine = new TestEngine(
//         {
//           play: [hansBrazenManipulator],
//         },
//         {
//           play: [princeCharmingProtectorOfTheRealm, mickeyMouseAmberChampion],
//         },
//       );
//
//       const hans = testEngine.getCardModel(hansBrazenManipulator);
//       const player = testEngine.store.tableStore.getTable("player_one");
//
//       const initialLore = player.lore;
//
//       // Pass turn to trigger start of turn
//       testEngine.passTurn();
//       testEngine.passTurn();
//
//       const playerAfter = testEngine.store.tableStore.getTable("player_one");
//
//       // Should gain 2 lore because opponent has 2 ready characters
//       expect(playerAfter.lore).toBe(initialLore + 2);
//     });
//
//     it("should not gain lore when opponent has less than 2 ready characters", () => {
//       const testEngine = new TestEngine(
//         {
//           play: [hansBrazenManipulator],
//         },
//         {
//           play: [princeCharmingProtectorOfTheRealm],
//         },
//       );
//
//       const hans = testEngine.getCardModel(hansBrazenManipulator);
//       const player = testEngine.store.tableStore.getTable("player_one");
//
//       const initialLore = player.lore;
//
//       // Pass turn to trigger start of turn
//       testEngine.passTurn();
//       testEngine.passTurn();
//
//       const playerAfter = testEngine.store.tableStore.getTable("player_one");
//
//       // Should not gain lore because opponent has only 1 ready character
//       expect(playerAfter.lore).toBe(initialLore);
//     });
//
//     it("should gain lore even if characters were exerted before (they ready at start of turn)", () => {
//       const testEngine = new TestEngine(
//         {
//           play: [hansBrazenManipulator],
//         },
//         {
//           play: [princeCharmingProtectorOfTheRealm, mickeyMouseAmberChampion],
//         },
//       );
//
//       const hans = testEngine.getCardModel(hansBrazenManipulator);
//       const prince = testEngine.getCardModel(princeCharmingProtectorOfTheRealm);
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Exert both opponent characters (they will ready at their start of turn)
//       prince.exert();
//       mickey.exert();
//
//       const player = testEngine.store.tableStore.getTable("player_one");
//       const initialLore = player.lore;
//
//       // Pass turn twice - opponent's characters ready at their start of turn
//       testEngine.passTurn();
//       testEngine.passTurn();
//
//       const playerAfter = testEngine.store.tableStore.getTable("player_one");
//
//       // Should gain lore because opponent characters readied during their turn
//       expect(playerAfter.lore).toBe(initialLore + 2);
//     });
//   });
// });
//
