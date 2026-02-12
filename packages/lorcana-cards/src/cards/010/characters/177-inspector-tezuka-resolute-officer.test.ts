import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { inspectorTezukaResoluteOfficer } from "./177-inspector-tezuka-resolute-officer";

describe("Inspector Tezuka - Resolute Officer", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [inspectorTezukaResoluteOfficer],
    });

    const cardUnderTest = testEngine.getCardModel(inspectorTezukaResoluteOfficer);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { inspectorTezukaResoluteOfficer } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Inspector Tezuka - Resolute Officer", () => {
//   Describe("Bodyguard - This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.", () => {
//     It("should have bodyguard ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [inspectorTezukaResoluteOfficer],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         InspectorTezukaResoluteOfficer,
//       );
//       Expect(cardUnderTest.hasBodyguard).toBe(true);
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [inspectorTezukaResoluteOfficer],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         InspectorTezukaResoluteOfficer,
//       );
//
//       Expect(cardUnderTest.strength).toBe(2);
//       Expect(cardUnderTest.willpower).toBe(3);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(2);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(inspectorTezukaResoluteOfficer.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics for Detective synergy", () => {
//       Expect(inspectorTezukaResoluteOfficer.characteristics).toEqual([
//         "storyborn",
//         "ally",
//         "detective",
//       ]);
//     });
//
//     It("should be steel color", () => {
//       Expect(inspectorTezukaResoluteOfficer.colors).toEqual(["steel"]);
//     });
//
//     It("should be common rarity", () => {
//       Expect(inspectorTezukaResoluteOfficer.rarity).toBe("common");
//     });
//   });
// });
//
