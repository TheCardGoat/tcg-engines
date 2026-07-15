// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldDuckRubyChampion,
//   HansBrazenManipulator,
//   ShereKhanFierceAndFurious,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Donald Duck - Ruby Champion", () => {
//   Describe("HIGH ENERGY - Your other Ruby characters get +1 {S}", () => {
//     It("should give +1 strength to other Ruby characters", () => {
//       Const testEngine = new TestEngine({
//         Play: [donaldDuckRubyChampion, hansBrazenManipulator],
//       });
//
//       Const donald = testEngine.getCardModel(donaldDuckRubyChampion);
//       Const hans = testEngine.getCardModel(hansBrazenManipulator);
//
//       // Hans is a Ruby character, should get +1 strength
//       Expect(hans.lorcanitoCard.strength).toBe(6);
//       Expect(hans.strength).toBe(7); // 6 + 1 from Donald
//     });
//
//     It("should not give bonus to non-Ruby characters", () => {
//       Const testEngine = new TestEngine({
//         Play: [donaldDuckRubyChampion],
//       });
//
//       Const donald = testEngine.getCardModel(donaldDuckRubyChampion);
//
//       // Donald should not buff himself
//       Expect(donald.lorcanitoCard.strength).toBe(4);
//       Expect(donald.strength).toBe(4); // No self-buff
//     });
//   });
//
//   Describe("POWERFUL REWARD - Your other Ruby characters with 7 {S} or more get +1 lore", () => {
//     It("should give +1 lore to Ruby characters with 7+ strength", () => {
//       Const testEngine = new TestEngine({
//         Play: [donaldDuckRubyChampion, shereKhanFierceAndFurious],
//       });
//
//       Const donald = testEngine.getCardModel(donaldDuckRubyChampion);
//       Const shereKhan = testEngine.getCardModel(shereKhanFierceAndFurious);
//
//       // Shere Khan is Ruby with 8 strength, gets +1 from HIGH ENERGY (9 total)
//       // So he should also get +1 lore from POWERFUL REWARD
//       Expect(shereKhan.lorcanitoCard.strength).toBe(8);
//       Expect(shereKhan.strength).toBe(9); // 8 + 1 from HIGH ENERGY
//       Expect(shereKhan.lorcanitoCard.lore).toBe(2);
//       Expect(shereKhan.lore).toBe(3); // 2 + 1 from POWERFUL REWARD
//     });
//
//     It("should not give lore bonus to characters with less than 7 strength", () => {
//       Const testEngine = new TestEngine({
//         Play: [donaldDuckRubyChampion, hansBrazenManipulator],
//       });
//
//       Const donald = testEngine.getCardModel(donaldDuckRubyChampion);
//       Const hans = testEngine.getCardModel(hansBrazenManipulator);
//
//       // Hans is Ruby with 6 strength, gets +1 from HIGH ENERGY (7 total)
//       // At exactly 7, he should get the lore bonus
//       Expect(hans.lorcanitoCard.strength).toBe(6);
//       Expect(hans.strength).toBe(7); // 6 + 1 from HIGH ENERGY
//       Expect(hans.lorcanitoCard.lore).toBe(2);
//       Expect(hans.lore).toBe(3); // 2 + 1 from POWERFUL REWARD (7 >= 7)
//     });
//
//     It("should not buff Donald Duck himself", () => {
//       Const testEngine = new TestEngine({
//         Play: [donaldDuckRubyChampion],
//       });
//
//       Const donald = testEngine.getCardModel(donaldDuckRubyChampion);
//
//       // Donald should not buff himself
//       Expect(donald.strength).toBe(4);
//       Expect(donald.lore).toBe(1);
//     });
//   });
// });
//
