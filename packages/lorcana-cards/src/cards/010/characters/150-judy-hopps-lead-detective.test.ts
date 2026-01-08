// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   genieInvestigativeMind,
//   judyHoppsLeadDetective,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Judy Hopps - Lead Detective", () => {
//   describe("Shift 4", () => {
//     it("should have shift ability", () => {
//       const testEngine = new TestEngine({
//         play: [judyHoppsLeadDetective],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(judyHoppsLeadDetective);
//       expect(cardUnderTest.hasShift).toBe(true);
//     });
//
//     it("should have shift 4 in abilities array", () => {
//       const shiftAbility = judyHoppsLeadDetective.abilities?.find(
//         (a) =>
//           "type" in a &&
//           a.type === "static" &&
//           "ability" in a &&
//           a.ability === "shift",
//       );
//       expect(shiftAbility).toBeDefined();
//       if (
//         shiftAbility &&
//         "type" in shiftAbility &&
//         shiftAbility.type === "static" &&
//         "ability" in shiftAbility &&
//         shiftAbility.ability === "shift" &&
//         "costs" in shiftAbility
//       ) {
//         expect(shiftAbility.costs).toEqual([{ type: "ink", amount: 4 }]);
//       }
//     });
//   });
//
//   describe("LATERAL THINKING", () => {
//     it("should grant Alert to Detective characters during your turn", () => {
//       const testEngine = new TestEngine({
//         play: [judyHoppsLeadDetective, genieInvestigativeMind],
//       });
//
//       const judy = testEngine.getCardModel(judyHoppsLeadDetective);
//       const genie = testEngine.getCardModel(genieInvestigativeMind);
//
//       // Both are Detective characters
//       expect(judy.characteristics).toContain("detective");
//       expect(genie.characteristics).toContain("detective");
//
//       // During your turn, they should have Alert
//       expect(judy.hasAlert).toBe(true);
//       expect(genie.hasAlert).toBe(true);
//     });
//
//     it("should grant Resist +2 to Detective characters during your turn", () => {
//       const testEngine = new TestEngine({
//         play: [judyHoppsLeadDetective, genieInvestigativeMind],
//       });
//
//       const judy = testEngine.getCardModel(judyHoppsLeadDetective);
//       const genie = testEngine.getCardModel(genieInvestigativeMind);
//
//       // During your turn, they should have Resist +2
//       expect(judy.hasResist).toBe(true);
//       expect(judy.damageReduction()).toBe(2);
//       expect(genie.hasResist).toBe(true);
//       expect(genie.damageReduction()).toBe(2);
//     });
//
//     it("should only apply to Detective characters (Judy herself)", () => {
//       const testEngine = new TestEngine({
//         play: [judyHoppsLeadDetective],
//       });
//
//       const judy = testEngine.getCardModel(judyHoppsLeadDetective);
//
//       // Judy is a Detective and should have both abilities
//       expect(judy.characteristics).toContain("detective");
//       expect(judy.hasAlert).toBe(true);
//       expect(judy.hasResist).toBe(true);
//       expect(judy.damageReduction()).toBe(2);
//     });
//   });
// });
//
