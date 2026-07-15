// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { genieInvestigativeMind } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Genie - Investigative Mind", () => {
//   Describe("Vanilla character", () => {
//     It("should have no special abilities", () => {
//       Expect(genieInvestigativeMind.abilities).toEqual([]);
//     });
//
//     It("should be playable", () => {
//       Const testEngine = new TestEngine({
//         Inkwell: genieInvestigativeMind.cost,
//         Hand: [genieInvestigativeMind],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(genieInvestigativeMind);
//       Expect(cardUnderTest.zone).toBe("hand");
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [genieInvestigativeMind],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(genieInvestigativeMind);
//
//       Expect(cardUnderTest.strength).toBe(4);
//       Expect(cardUnderTest.willpower).toBe(7);
//       Expect(cardUnderTest.lore).toBe(2);
//       Expect(cardUnderTest.cost).toBe(5);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(genieInvestigativeMind.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics for Detective synergy", () => {
//       Expect(genieInvestigativeMind.characteristics).toEqual([
//         "storyborn",
//         "ally",
//         "detective",
//       ]);
//     });
//
//     It("should be sapphire color", () => {
//       Expect(genieInvestigativeMind.colors).toEqual(["sapphire"]);
//     });
//   });
// });
//
