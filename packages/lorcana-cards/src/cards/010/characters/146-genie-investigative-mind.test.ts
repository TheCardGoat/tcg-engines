// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { genieInvestigativeMind } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Genie - Investigative Mind", () => {
//   describe("Vanilla character", () => {
//     it("should have no special abilities", () => {
//       expect(genieInvestigativeMind.abilities).toEqual([]);
//     });
//
//     it("should be playable", () => {
//       const testEngine = new TestEngine({
//         inkwell: genieInvestigativeMind.cost,
//         hand: [genieInvestigativeMind],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(genieInvestigativeMind);
//       expect(cardUnderTest.zone).toBe("hand");
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [genieInvestigativeMind],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(genieInvestigativeMind);
//
//       expect(cardUnderTest.strength).toBe(4);
//       expect(cardUnderTest.willpower).toBe(7);
//       expect(cardUnderTest.lore).toBe(2);
//       expect(cardUnderTest.cost).toBe(5);
//     });
//
//     it("should be inkwell card", () => {
//       expect(genieInvestigativeMind.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics for Detective synergy", () => {
//       expect(genieInvestigativeMind.characteristics).toEqual([
//         "storyborn",
//         "ally",
//         "detective",
//       ]);
//     });
//
//     it("should be sapphire color", () => {
//       expect(genieInvestigativeMind.colors).toEqual(["sapphire"]);
//     });
//   });
// });
//
