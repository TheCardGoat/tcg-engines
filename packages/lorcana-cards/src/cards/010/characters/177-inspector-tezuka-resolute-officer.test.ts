import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { inspectorTezukaResoluteOfficer } from "./177-inspector-tezuka-resolute-officer";

describe("Inspector Tezuka - Resolute Officer", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [inspectorTezukaResoluteOfficer],
    });

    const cardUnderTest = testEngine.getCardModel(
      inspectorTezukaResoluteOfficer,
    );
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { inspectorTezukaResoluteOfficer } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Inspector Tezuka - Resolute Officer", () => {
//   describe("Bodyguard - This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.", () => {
//     it("should have bodyguard ability", () => {
//       const testEngine = new TestEngine({
//         play: [inspectorTezukaResoluteOfficer],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         inspectorTezukaResoluteOfficer,
//       );
//       expect(cardUnderTest.hasBodyguard).toBe(true);
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [inspectorTezukaResoluteOfficer],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         inspectorTezukaResoluteOfficer,
//       );
//
//       expect(cardUnderTest.strength).toBe(2);
//       expect(cardUnderTest.willpower).toBe(3);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(2);
//     });
//
//     it("should be inkwell card", () => {
//       expect(inspectorTezukaResoluteOfficer.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics for Detective synergy", () => {
//       expect(inspectorTezukaResoluteOfficer.characteristics).toEqual([
//         "storyborn",
//         "ally",
//         "detective",
//       ]);
//     });
//
//     it("should be steel color", () => {
//       expect(inspectorTezukaResoluteOfficer.colors).toEqual(["steel"]);
//     });
//
//     it("should be common rarity", () => {
//       expect(inspectorTezukaResoluteOfficer.rarity).toBe("common");
//     });
//   });
// });
//
