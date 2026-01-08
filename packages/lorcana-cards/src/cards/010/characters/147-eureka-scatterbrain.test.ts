// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { eurekaScatterbrain } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Eureka - Scatterbrain", () => {
//   describe("WARD", () => {
//     it("should have ward ability", () => {
//       const testEngine = new TestEngine({
//         play: [eurekaScatterbrain],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(eurekaScatterbrain);
//       expect(cardUnderTest.hasWard).toBe(true);
//     });
//
//     it("should have ward in abilities array", () => {
//       const wardAbility = eurekaScatterbrain.abilities?.find(
//         (a) =>
//           "type" in a &&
//           a.type === "static" &&
//           "ability" in a &&
//           a.ability === "ward",
//       );
//       expect(wardAbility).toBeDefined();
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [eurekaScatterbrain],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(eurekaScatterbrain);
//
//       expect(cardUnderTest.strength).toBe(5);
//       expect(cardUnderTest.willpower).toBe(5);
//       expect(cardUnderTest.lore).toBe(2);
//       expect(cardUnderTest.cost).toBe(5);
//     });
//
//     it("should be inkwell card", () => {
//       expect(eurekaScatterbrain.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(eurekaScatterbrain.characteristics).toEqual(["dreamborn", "ally"]);
//     });
//
//     it("should be sapphire color", () => {
//       expect(eurekaScatterbrain.colors).toEqual(["sapphire"]);
//     });
//   });
// });
//
