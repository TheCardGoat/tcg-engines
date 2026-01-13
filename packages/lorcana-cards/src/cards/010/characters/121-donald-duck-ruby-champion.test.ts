// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   donaldDuckRubyChampion,
//   hansBrazenManipulator,
//   shereKhanFierceAndFurious,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Donald Duck - Ruby Champion", () => {
//   describe("HIGH ENERGY - Your other Ruby characters get +1 {S}", () => {
//     it("should give +1 strength to other Ruby characters", () => {
//       const testEngine = new TestEngine({
//         play: [donaldDuckRubyChampion, hansBrazenManipulator],
//       });
//
//       const donald = testEngine.getCardModel(donaldDuckRubyChampion);
//       const hans = testEngine.getCardModel(hansBrazenManipulator);
//
//       // Hans is a Ruby character, should get +1 strength
//       expect(hans.lorcanitoCard.strength).toBe(6);
//       expect(hans.strength).toBe(7); // 6 + 1 from Donald
//     });
//
//     it("should not give bonus to non-Ruby characters", () => {
//       const testEngine = new TestEngine({
//         play: [donaldDuckRubyChampion],
//       });
//
//       const donald = testEngine.getCardModel(donaldDuckRubyChampion);
//
//       // Donald should not buff himself
//       expect(donald.lorcanitoCard.strength).toBe(4);
//       expect(donald.strength).toBe(4); // No self-buff
//     });
//   });
//
//   describe("POWERFUL REWARD - Your other Ruby characters with 7 {S} or more get +1 lore", () => {
//     it("should give +1 lore to Ruby characters with 7+ strength", () => {
//       const testEngine = new TestEngine({
//         play: [donaldDuckRubyChampion, shereKhanFierceAndFurious],
//       });
//
//       const donald = testEngine.getCardModel(donaldDuckRubyChampion);
//       const shereKhan = testEngine.getCardModel(shereKhanFierceAndFurious);
//
//       // Shere Khan is Ruby with 8 strength, gets +1 from HIGH ENERGY (9 total)
//       // So he should also get +1 lore from POWERFUL REWARD
//       expect(shereKhan.lorcanitoCard.strength).toBe(8);
//       expect(shereKhan.strength).toBe(9); // 8 + 1 from HIGH ENERGY
//       expect(shereKhan.lorcanitoCard.lore).toBe(2);
//       expect(shereKhan.lore).toBe(3); // 2 + 1 from POWERFUL REWARD
//     });
//
//     it("should not give lore bonus to characters with less than 7 strength", () => {
//       const testEngine = new TestEngine({
//         play: [donaldDuckRubyChampion, hansBrazenManipulator],
//       });
//
//       const donald = testEngine.getCardModel(donaldDuckRubyChampion);
//       const hans = testEngine.getCardModel(hansBrazenManipulator);
//
//       // Hans is Ruby with 6 strength, gets +1 from HIGH ENERGY (7 total)
//       // At exactly 7, he should get the lore bonus
//       expect(hans.lorcanitoCard.strength).toBe(6);
//       expect(hans.strength).toBe(7); // 6 + 1 from HIGH ENERGY
//       expect(hans.lorcanitoCard.lore).toBe(2);
//       expect(hans.lore).toBe(3); // 2 + 1 from POWERFUL REWARD (7 >= 7)
//     });
//
//     it("should not buff Donald Duck himself", () => {
//       const testEngine = new TestEngine({
//         play: [donaldDuckRubyChampion],
//       });
//
//       const donald = testEngine.getCardModel(donaldDuckRubyChampion);
//
//       // Donald should not buff himself
//       expect(donald.strength).toBe(4);
//       expect(donald.lore).toBe(1);
//     });
//   });
// });
//
