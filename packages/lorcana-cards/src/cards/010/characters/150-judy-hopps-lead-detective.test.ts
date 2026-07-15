// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GenieInvestigativeMind,
//   JudyHoppsLeadDetective,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Judy Hopps - Lead Detective", () => {
//   Describe("Shift 4", () => {
//     It("should have shift ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [judyHoppsLeadDetective],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(judyHoppsLeadDetective);
//       Expect(cardUnderTest.hasShift).toBe(true);
//     });
//
//     It("should have shift 4 in abilities array", () => {
//       Const shiftAbility = judyHoppsLeadDetective.abilities?.find(
//         (a) =>
//           "type" in a &&
//           A.type === "static" &&
//           "ability" in a &&
//           A.ability === "shift",
//       );
//       Expect(shiftAbility).toBeDefined();
//       If (
//         ShiftAbility &&
//         "type" in shiftAbility &&
//         ShiftAbility.type === "static" &&
//         "ability" in shiftAbility &&
//         ShiftAbility.ability === "shift" &&
//         "costs" in shiftAbility
//       ) {
//         Expect(shiftAbility.costs).toEqual([{ type: "ink", amount: 4 }]);
//       }
//     });
//   });
//
//   Describe("LATERAL THINKING", () => {
//     It("should grant Alert to Detective characters during your turn", () => {
//       Const testEngine = new TestEngine({
//         Play: [judyHoppsLeadDetective, genieInvestigativeMind],
//       });
//
//       Const judy = testEngine.getCardModel(judyHoppsLeadDetective);
//       Const genie = testEngine.getCardModel(genieInvestigativeMind);
//
//       // Both are Detective characters
//       Expect(judy.characteristics).toContain("detective");
//       Expect(genie.characteristics).toContain("detective");
//
//       // During your turn, they should have Alert
//       Expect(judy.hasAlert).toBe(true);
//       Expect(genie.hasAlert).toBe(true);
//     });
//
//     It("should grant Resist +2 to Detective characters during your turn", () => {
//       Const testEngine = new TestEngine({
//         Play: [judyHoppsLeadDetective, genieInvestigativeMind],
//       });
//
//       Const judy = testEngine.getCardModel(judyHoppsLeadDetective);
//       Const genie = testEngine.getCardModel(genieInvestigativeMind);
//
//       // During your turn, they should have Resist +2
//       Expect(judy.hasResist).toBe(true);
//       Expect(judy.damageReduction()).toBe(2);
//       Expect(genie.hasResist).toBe(true);
//       Expect(genie.damageReduction()).toBe(2);
//     });
//
//     It("should only apply to Detective characters (Judy herself)", () => {
//       Const testEngine = new TestEngine({
//         Play: [judyHoppsLeadDetective],
//       });
//
//       Const judy = testEngine.getCardModel(judyHoppsLeadDetective);
//
//       // Judy is a Detective and should have both abilities
//       Expect(judy.characteristics).toContain("detective");
//       Expect(judy.hasAlert).toBe(true);
//       Expect(judy.hasResist).toBe(true);
//       Expect(judy.damageReduction()).toBe(2);
//     });
//   });
// });
//
