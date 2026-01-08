// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyMouseDetective } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mickey Mouse - Detective", () => {
//   describe("GET A CLUE", () => {
//     it("should have the ability defined with correct structure", () => {
//       const ability = mickeyMouseDetective.abilities?.find(
//         (a) => "name" in a && a.name === "GET A CLUE",
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
//     it("should be optional ability", () => {
//       const ability = mickeyMouseDetective.abilities?.find(
//         (a) => "name" in a && a.name === "GET A CLUE",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "optional" in ability) {
//         expect(ability.optional).toBe(true);
//       }
//     });
//
//     it("should trigger when you play this character", () => {
//       const ability = mickeyMouseDetective.abilities?.find(
//         (a) => "name" in a && a.name === "GET A CLUE",
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
//         expect(ability.trigger.on).toBe("play");
//       }
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [mickeyMouseDetective],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(mickeyMouseDetective);
//
//       expect(cardUnderTest.strength).toBe(1);
//       expect(cardUnderTest.willpower).toBe(3);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(3);
//     });
//
//     it("should not be inkwell card", () => {
//       expect(mickeyMouseDetective.inkwell).toBe(false);
//     });
//
//     it("should have correct characteristics for Detective synergy", () => {
//       expect(mickeyMouseDetective.characteristics).toEqual([
//         "dreamborn",
//         "hero",
//         "detective",
//       ]);
//     });
//
//     it("should be sapphire color", () => {
//       expect(mickeyMouseDetective.colors).toEqual(["sapphire"]);
//     });
//
//     it("should be common rarity", () => {
//       expect(mickeyMouseDetective.rarity).toBe("common");
//     });
//   });
// });
//
