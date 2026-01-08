// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { ryderFleetfootedInfiltrator } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Ryder - Fleet-Footed Infiltrator", () => {
//   it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [ryderFleetfootedInfiltrator],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(ryderFleetfootedInfiltrator);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
