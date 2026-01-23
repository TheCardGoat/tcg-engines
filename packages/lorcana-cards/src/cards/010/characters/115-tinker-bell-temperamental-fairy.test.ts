// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   bronxFerociousBeast,
//   diabloWatchfulRaven,
//   hermesHarriedMessenger,
//   tinkerBellTemperamentalFairy,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Tinker Bell - Temperamental Fairy", () => {
//   describe("Shift 3", () => {
//     it("should have Shift ability", () => {
//       const testEngine = new TestEngine({
//         play: [tinkerBellTemperamentalFairy],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         tinkerBellTemperamentalFairy,
//       );
//       expect(cardUnderTest.hasShift).toBe(true);
//     });
//
//     it("should have shift cost of 3", () => {
//       const shiftAbility = tinkerBellTemperamentalFairy.abilities?.find(
//         (a) => "ability" in a && a.ability === "shift",
//       );
//
//       expect(shiftAbility).toBeDefined();
//
//       if (shiftAbility && "costs" in shiftAbility) {
//         expect(shiftAbility.costs).toEqual([{ type: "ink", amount: 3 }]);
//       }
//     });
//   });
//
//   describe("HARMLESS DIVERSION - When you play this character, exert chosen opposing character with 2 {S} or less", () => {
//     it("should have the HARMLESS DIVERSION ability defined", () => {
//       const harmlessDiversion = tinkerBellTemperamentalFairy.abilities?.find(
//         (a) => "name" in a && a.name === "HARMLESS DIVERSION",
//       );
//
//       expect(harmlessDiversion).toBeDefined();
//
//       if (
//         harmlessDiversion &&
//         "effects" in harmlessDiversion &&
//         Array.isArray(harmlessDiversion.effects)
//       ) {
//         expect(harmlessDiversion.effects).toHaveLength(1);
//         const effect = harmlessDiversion.effects[0] as any;
//         expect(effect.type).toBe("exert");
//
//         // Should target opposing characters with strength <= 2
//         if ("target" in harmlessDiversion) {
//           const target = harmlessDiversion.target as any;
//           expect(target.filters).toBeDefined();
//
//           const strengthFilter = target.filters.find(
//             (f: any) => f.filter === "attribute" && f.value === "strength",
//           );
//           expect(strengthFilter).toBeDefined();
//           expect(strengthFilter.comparison.operator).toBe("lte");
//           expect(strengthFilter.comparison.value).toBe(2);
//         }
//       }
//     });
//
//     it.skip("should trigger when played and require a target (integration test)", async () => {
//       // Note: This test requires a character with 2 or less strength to be available
//       // Diablo (3), Hermes (3), and Bronx (6) all have too much strength
//       // This test is skipped until we have a suitable test character
//       expect(true).toBe(true);
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [tinkerBellTemperamentalFairy],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         tinkerBellTemperamentalFairy,
//       );
//
//       expect(cardUnderTest.strength).toBe(5);
//       expect(cardUnderTest.willpower).toBe(3);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(5);
//     });
//
//     it("should be inkwell card", () => {
//       expect(tinkerBellTemperamentalFairy.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(tinkerBellTemperamentalFairy.characteristics).toEqual([
//         "floodborn",
//         "ally",
//         "fairy",
//       ]);
//     });
//
//     it("should be ruby color", () => {
//       expect(tinkerBellTemperamentalFairy.colors).toEqual(["ruby"]);
//     });
//   });
//
//   describe("Gameplay", () => {
//     it("should be playable from hand", async () => {
//       const testEngine = new TestEngine({
//         inkwell: tinkerBellTemperamentalFairy.cost,
//         hand: [tinkerBellTemperamentalFairy],
//       });
//
//       await testEngine.playCard(tinkerBellTemperamentalFairy);
//
//       const cardUnderTest = testEngine.getCardModel(
//         tinkerBellTemperamentalFairy,
//       );
//       expect(cardUnderTest.zone).toBe("play");
//     });
//   });
// });
//
