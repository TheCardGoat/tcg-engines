// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tipoJuniorChipmunk } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tipo - Junior Chipmunk", () => {
//   It.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [tipoJuniorChipmunk],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(tipoJuniorChipmunk);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
