// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { kristoffMiningTheRuins } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Kristoff - Mining the Ruins", () => {
//   describe("Boost 1", () => {
//     it("should have boost ability", () => {
//       const testEngine = new TestEngine({
//         play: [kristoffMiningTheRuins],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(kristoffMiningTheRuins);
//       expect(cardUnderTest.hasBoost).toBe(true);
//     });
//   });
//
//   describe("A TREASURE THAT MUST BE EARNED", () => {
//     it("should have the ability defined with correct structure", () => {
//       // Verify the ability exists with correct structure
//       const ability = kristoffMiningTheRuins.abilities?.find(
//         (a) => "name" in a && a.name === "A TREASURE THAT MUST BE EARNED",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         const moveEffect = ability.effects[0] as any;
//         expect(moveEffect.type).toBe("move");
//         expect(moveEffect.to).toBe("inkwell");
//         expect(moveEffect.exerted).toBe(true);
//       }
//     });
//
//     it("should have condition checking for card under character", () => {
//       const ability = kristoffMiningTheRuins.abilities?.find(
//         (a) => "name" in a && a.name === "A TREASURE THAT MUST BE EARNED",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (
//         ability &&
//         "conditions" in ability &&
//         Array.isArray(ability.conditions)
//       ) {
//         expect(ability.conditions).toBeDefined();
//         expect(Array.isArray(ability.conditions)).toBe(true);
//         expect(ability.conditions.length).toBeGreaterThan(0);
//       }
//     });
//
//     it("should trigger when character quests", () => {
//       const ability = kristoffMiningTheRuins.abilities?.find(
//         (a) => "name" in a && a.name === "A TREASURE THAT MUST BE EARNED",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (
//         ability &&
//         "trigger" in ability &&
//         ability.trigger &&
//         typeof ability.trigger === "object" &&
//         "on" in ability.trigger
//       ) {
//         expect(ability.trigger.on).toBe("quest");
//       }
//     });
//
//     // TODO: Once boost card mechanics are fully implemented in TestEngine, add integration tests:
//     // - Test that ability triggers when Kristoff quests with a card under him
//     // - Test that ability doesn't trigger when Kristoff quests without a card under him
//     // - Test that card is added to inkwell exerted
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [kristoffMiningTheRuins],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(kristoffMiningTheRuins);
//
//       expect(cardUnderTest.strength).toBe(2);
//       expect(cardUnderTest.willpower).toBe(3);
//       expect(cardUnderTest.lore).toBe(2);
//       expect(cardUnderTest.cost).toBe(3);
//     });
//
//     it("should be inkwell card", () => {
//       expect(kristoffMiningTheRuins.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(kristoffMiningTheRuins.characteristics).toEqual([
//         "storyborn",
//         "ally",
//       ]);
//     });
//
//     it("should be sapphire color", () => {
//       expect(kristoffMiningTheRuins.colors).toEqual(["sapphire"]);
//     });
//
//     it("should be rare rarity", () => {
//       expect(kristoffMiningTheRuins.rarity).toBe("rare");
//     });
//   });
// });
//
