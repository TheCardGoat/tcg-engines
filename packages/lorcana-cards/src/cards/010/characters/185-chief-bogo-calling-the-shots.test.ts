// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   chiefBogoCallingTheShots,
//   herculesMightyLeader,
//   mickeyMouseAmberChampion,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Chief Bogo - Calling the Shots", () => {
//   describe("MY JURISDICTION - During your turn, this character can't be dealt damage", () => {
//     it("should not take damage during your turn", () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: chiefBogoCallingTheShots.cost + herculesMightyLeader.cost,
//           hand: [herculesMightyLeader],
//           play: [chiefBogoCallingTheShots],
//         },
//         {
//           play: [],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(chiefBogoCallingTheShots);
//       const hercules = testEngine.getCardModel(herculesMightyLeader);
//
//       testEngine.playCard(hercules);
//       hercules.exert();
//
//       // During our turn, try to deal damage to Chief Bogo with a damage source
//       cardUnderTest.updateCardDamage(2, "add", hercules);
//
//       // Should not take damage during our turn
//       expect(cardUnderTest.damage).toBe(0);
//     });
//
//     it("should take damage during opponent's turn", () => {
//       const testEngine = new TestEngine(
//         {
//           play: [chiefBogoCallingTheShots],
//         },
//         {
//           inkwell: herculesMightyLeader.cost,
//           hand: [herculesMightyLeader],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(chiefBogoCallingTheShots);
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//
//       const hercules = testEngine.getCardModel(herculesMightyLeader);
//       testEngine.playCard(hercules);
//       hercules.exert();
//
//       // During opponent's turn, deal damage to Chief Bogo with a damage source
//       cardUnderTest.updateCardDamage(2, "add", hercules);
//
//       // Should take damage during opponent's turn
//       expect(cardUnderTest.damage).toBe(2);
//     });
//   });
//
//   describe("DEPUTIZE - Your other characters gain the Detective classification", () => {
//     it("should grant Detective classification to other characters", () => {
//       const testEngine = new TestEngine({
//         play: [chiefBogoCallingTheShots, mickeyMouseAmberChampion],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(chiefBogoCallingTheShots);
//       const otherCharacter = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey Mouse should not have Detective classification initially in the card definition
//       expect(
//         otherCharacter.lorcanitoCard.characteristics.includes("detective"),
//       ).toBe(false);
//
//       // Check if Mickey Mouse has gained the Detective classification from Chief Bogo
//       const hasDetective = otherCharacter.characteristics.includes("detective");
//       expect(hasDetective).toBe(true);
//     });
//
//     it("should not grant Detective classification to itself", () => {
//       const testEngine = new TestEngine({
//         play: [chiefBogoCallingTheShots],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(chiefBogoCallingTheShots);
//
//       // Chief Bogo should still only have its original characteristics
//       const characteristicsCount = cardUnderTest.characteristics.length;
//       const originalCount = chiefBogoCallingTheShots.characteristics.length;
//
//       // Should not have extra Detective from its own ability
//       expect(characteristicsCount).toBe(originalCount);
//     });
//
//     it("should remove Detective classification when Chief Bogo leaves play", () => {
//       const testEngine = new TestEngine({
//         play: [chiefBogoCallingTheShots, mickeyMouseAmberChampion],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(chiefBogoCallingTheShots);
//       const otherCharacter = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey Mouse should have Detective classification while Chief Bogo is in play
//       expect(otherCharacter.characteristics.includes("detective")).toBe(true);
//
//       // Banish Chief Bogo
//       cardUnderTest.moveTo("discard");
//
//       // Mickey Mouse should no longer have Detective classification
//       expect(otherCharacter.characteristics.includes("detective")).toBe(false);
//     });
//
//     it("should grant Detective classification to characters played after Chief Bogo", () => {
//       const testEngine = new TestEngine({
//         inkwell: mickeyMouseAmberChampion.cost,
//         play: [chiefBogoCallingTheShots],
//         hand: [mickeyMouseAmberChampion],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(chiefBogoCallingTheShots);
//
//       // Play Mickey Mouse after Chief Bogo is already in play
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//       testEngine.playCard(mickey);
//
//       // Mickey Mouse should have Detective classification
//       expect(mickey.characteristics.includes("detective")).toBe(true);
//     });
//   });
// });
//
