// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BronxFerociousBeast,
//   DiabloWatchfulRaven,
//   HermesHarriedMessenger,
//   TinkerBellTemperamentalFairy,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tinker Bell - Temperamental Fairy", () => {
//   Describe("Shift 3", () => {
//     It("should have Shift ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [tinkerBellTemperamentalFairy],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TinkerBellTemperamentalFairy,
//       );
//       Expect(cardUnderTest.hasShift).toBe(true);
//     });
//
//     It("should have shift cost of 3", () => {
//       Const shiftAbility = tinkerBellTemperamentalFairy.abilities?.find(
//         (a) => "ability" in a && a.ability === "shift",
//       );
//
//       Expect(shiftAbility).toBeDefined();
//
//       If (shiftAbility && "costs" in shiftAbility) {
//         Expect(shiftAbility.costs).toEqual([{ type: "ink", amount: 3 }]);
//       }
//     });
//   });
//
//   Describe("HARMLESS DIVERSION - When you play this character, exert chosen opposing character with 2 {S} or less", () => {
//     It("should have the HARMLESS DIVERSION ability defined", () => {
//       Const harmlessDiversion = tinkerBellTemperamentalFairy.abilities?.find(
//         (a) => "name" in a && a.name === "HARMLESS DIVERSION",
//       );
//
//       Expect(harmlessDiversion).toBeDefined();
//
//       If (
//         HarmlessDiversion &&
//         "effects" in harmlessDiversion &&
//         Array.isArray(harmlessDiversion.effects)
//       ) {
//         Expect(harmlessDiversion.effects).toHaveLength(1);
//         Const effect = harmlessDiversion.effects[0] as any;
//         Expect(effect.type).toBe("exert");
//
//         // Should target opposing characters with strength <= 2
//         If ("target" in harmlessDiversion) {
//           Const target = harmlessDiversion.target as any;
//           Expect(target.filters).toBeDefined();
//
//           Const strengthFilter = target.filters.find(
//             (f: any) => f.filter === "attribute" && f.value === "strength",
//           );
//           Expect(strengthFilter).toBeDefined();
//           Expect(strengthFilter.comparison.operator).toBe("lte");
//           Expect(strengthFilter.comparison.value).toBe(2);
//         }
//       }
//     });
//
//     It.skip("should trigger when played and require a target (integration test)", async () => {
//       // Note: This test requires a character with 2 or less strength to be available
//       // Diablo (3), Hermes (3), and Bronx (6) all have too much strength
//       // This test is skipped until we have a suitable test character
//       Expect(true).toBe(true);
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [tinkerBellTemperamentalFairy],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TinkerBellTemperamentalFairy,
//       );
//
//       Expect(cardUnderTest.strength).toBe(5);
//       Expect(cardUnderTest.willpower).toBe(3);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(5);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(tinkerBellTemperamentalFairy.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(tinkerBellTemperamentalFairy.characteristics).toEqual([
//         "floodborn",
//         "ally",
//         "fairy",
//       ]);
//     });
//
//     It("should be ruby color", () => {
//       Expect(tinkerBellTemperamentalFairy.colors).toEqual(["ruby"]);
//     });
//   });
//
//   Describe("Gameplay", () => {
//     It("should be playable from hand", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: tinkerBellTemperamentalFairy.cost,
//         Hand: [tinkerBellTemperamentalFairy],
//       });
//
//       Await testEngine.playCard(tinkerBellTemperamentalFairy);
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TinkerBellTemperamentalFairy,
//       );
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//   });
// });
//
