// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HiroHamadaIntuitiveThinker,
//   LumiereFiredUp,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hiro Hamada - Intuitive Thinker", () => {
//   It("LOOK FOR A NEW ANGLE {E} - Ready chosen Floodborn character.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [hiroHamadaIntuitiveThinker, lumiereFiredUp],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(hiroHamadaIntuitiveThinker);
//     Const target = testEngine.getCardModel(lumiereFiredUp);
//
//     Target.exert();
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: "LOOK FOR A NEW ANGLE",
//       Targets: [target],
//     });
//
//     Expect(target.exerted).toBe(false);
//   });
// });
//
