// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseDetective } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mickey Mouse - Detective", () => {
//   Describe("GET A CLUE", () => {
//     It("should have the ability defined with correct structure", () => {
//       Const ability = mickeyMouseDetective.abilities?.find(
//         (a) => "name" in a && a.name === "GET A CLUE",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Const moveEffect = ability.effects[0] as any;
//         Expect(moveEffect.type).toBe("move");
//         Expect(moveEffect.to).toBe("inkwell");
//         Expect(moveEffect.exerted).toBe(true);
//       }
//     });
//
//     It("should be optional ability", () => {
//       Const ability = mickeyMouseDetective.abilities?.find(
//         (a) => "name" in a && a.name === "GET A CLUE",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "optional" in ability) {
//         Expect(ability.optional).toBe(true);
//       }
//     });
//
//     It("should trigger when you play this character", () => {
//       Const ability = mickeyMouseDetective.abilities?.find(
//         (a) => "name" in a && a.name === "GET A CLUE",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (
//         Ability &&
//         "trigger" in ability &&
//         Ability.trigger &&
//         Typeof ability.trigger === "object" &&
//         "on" in ability.trigger
//       ) {
//         Expect(ability.trigger.on).toBe("play");
//       }
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [mickeyMouseDetective],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(mickeyMouseDetective);
//
//       Expect(cardUnderTest.strength).toBe(1);
//       Expect(cardUnderTest.willpower).toBe(3);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(3);
//     });
//
//     It("should not be inkwell card", () => {
//       Expect(mickeyMouseDetective.inkwell).toBe(false);
//     });
//
//     It("should have correct characteristics for Detective synergy", () => {
//       Expect(mickeyMouseDetective.characteristics).toEqual([
//         "dreamborn",
//         "hero",
//         "detective",
//       ]);
//     });
//
//     It("should be sapphire color", () => {
//       Expect(mickeyMouseDetective.colors).toEqual(["sapphire"]);
//     });
//
//     It("should be common rarity", () => {
//       Expect(mickeyMouseDetective.rarity).toBe("common");
//     });
//   });
// });
//
