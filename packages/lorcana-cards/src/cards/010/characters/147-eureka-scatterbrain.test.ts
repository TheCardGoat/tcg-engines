// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { eurekaScatterbrain } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Eureka - Scatterbrain", () => {
//   Describe("WARD", () => {
//     It("should have ward ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [eurekaScatterbrain],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(eurekaScatterbrain);
//       Expect(cardUnderTest.hasWard).toBe(true);
//     });
//
//     It("should have ward in abilities array", () => {
//       Const wardAbility = eurekaScatterbrain.abilities?.find(
//         (a) =>
//           "type" in a &&
//           A.type === "static" &&
//           "ability" in a &&
//           A.ability === "ward",
//       );
//       Expect(wardAbility).toBeDefined();
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [eurekaScatterbrain],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(eurekaScatterbrain);
//
//       Expect(cardUnderTest.strength).toBe(5);
//       Expect(cardUnderTest.willpower).toBe(5);
//       Expect(cardUnderTest.lore).toBe(2);
//       Expect(cardUnderTest.cost).toBe(5);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(eurekaScatterbrain.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(eurekaScatterbrain.characteristics).toEqual(["dreamborn", "ally"]);
//     });
//
//     It("should be sapphire color", () => {
//       Expect(eurekaScatterbrain.colors).toEqual(["sapphire"]);
//     });
//   });
// });
//
