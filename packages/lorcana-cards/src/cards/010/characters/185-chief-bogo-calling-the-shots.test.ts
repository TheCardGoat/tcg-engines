// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChiefBogoCallingTheShots,
//   HerculesMightyLeader,
//   MickeyMouseAmberChampion,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Chief Bogo - Calling the Shots", () => {
//   Describe("MY JURISDICTION - During your turn, this character can't be dealt damage", () => {
//     It("should not take damage during your turn", () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: chiefBogoCallingTheShots.cost + herculesMightyLeader.cost,
//           Hand: [herculesMightyLeader],
//           Play: [chiefBogoCallingTheShots],
//         },
//         {
//           Play: [],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(chiefBogoCallingTheShots);
//       Const hercules = testEngine.getCardModel(herculesMightyLeader);
//
//       TestEngine.playCard(hercules);
//       Hercules.exert();
//
//       // During our turn, try to deal damage to Chief Bogo with a damage source
//       CardUnderTest.updateCardDamage(2, "add", hercules);
//
//       // Should not take damage during our turn
//       Expect(cardUnderTest.damage).toBe(0);
//     });
//
//     It("should take damage during opponent's turn", () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [chiefBogoCallingTheShots],
//         },
//         {
//           Inkwell: herculesMightyLeader.cost,
//           Hand: [herculesMightyLeader],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(chiefBogoCallingTheShots);
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//
//       Const hercules = testEngine.getCardModel(herculesMightyLeader);
//       TestEngine.playCard(hercules);
//       Hercules.exert();
//
//       // During opponent's turn, deal damage to Chief Bogo with a damage source
//       CardUnderTest.updateCardDamage(2, "add", hercules);
//
//       // Should take damage during opponent's turn
//       Expect(cardUnderTest.damage).toBe(2);
//     });
//   });
//
//   Describe("DEPUTIZE - Your other characters gain the Detective classification", () => {
//     It("should grant Detective classification to other characters", () => {
//       Const testEngine = new TestEngine({
//         Play: [chiefBogoCallingTheShots, mickeyMouseAmberChampion],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(chiefBogoCallingTheShots);
//       Const otherCharacter = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey Mouse should not have Detective classification initially in the card definition
//       Expect(
//         OtherCharacter.lorcanitoCard.characteristics.includes("detective"),
//       ).toBe(false);
//
//       // Check if Mickey Mouse has gained the Detective classification from Chief Bogo
//       Const hasDetective = otherCharacter.characteristics.includes("detective");
//       Expect(hasDetective).toBe(true);
//     });
//
//     It("should not grant Detective classification to itself", () => {
//       Const testEngine = new TestEngine({
//         Play: [chiefBogoCallingTheShots],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(chiefBogoCallingTheShots);
//
//       // Chief Bogo should still only have its original characteristics
//       Const characteristicsCount = cardUnderTest.characteristics.length;
//       Const originalCount = chiefBogoCallingTheShots.characteristics.length;
//
//       // Should not have extra Detective from its own ability
//       Expect(characteristicsCount).toBe(originalCount);
//     });
//
//     It("should remove Detective classification when Chief Bogo leaves play", () => {
//       Const testEngine = new TestEngine({
//         Play: [chiefBogoCallingTheShots, mickeyMouseAmberChampion],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(chiefBogoCallingTheShots);
//       Const otherCharacter = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey Mouse should have Detective classification while Chief Bogo is in play
//       Expect(otherCharacter.characteristics.includes("detective")).toBe(true);
//
//       // Banish Chief Bogo
//       CardUnderTest.moveTo("discard");
//
//       // Mickey Mouse should no longer have Detective classification
//       Expect(otherCharacter.characteristics.includes("detective")).toBe(false);
//     });
//
//     It("should grant Detective classification to characters played after Chief Bogo", () => {
//       Const testEngine = new TestEngine({
//         Inkwell: mickeyMouseAmberChampion.cost,
//         Play: [chiefBogoCallingTheShots],
//         Hand: [mickeyMouseAmberChampion],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(chiefBogoCallingTheShots);
//
//       // Play Mickey Mouse after Chief Bogo is already in play
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//       TestEngine.playCard(mickey);
//
//       // Mickey Mouse should have Detective classification
//       Expect(mickey.characteristics.includes("detective")).toBe(true);
//     });
//   });
// });
//
