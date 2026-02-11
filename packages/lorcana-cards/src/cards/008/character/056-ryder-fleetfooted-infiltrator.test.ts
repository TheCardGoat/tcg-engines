// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { ryderFleetfootedInfiltrator } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ryder - Fleet-Footed Infiltrator", () => {
//   It.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [ryderFleetfootedInfiltrator],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(ryderFleetfootedInfiltrator);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
