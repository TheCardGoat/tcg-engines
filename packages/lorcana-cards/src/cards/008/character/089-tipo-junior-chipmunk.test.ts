// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { tipoJuniorChipmunk } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Tipo - Junior Chipmunk", () => {
//   it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [tipoJuniorChipmunk],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(tipoJuniorChipmunk);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
