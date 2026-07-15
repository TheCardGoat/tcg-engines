// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { plutoGuardDog } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pluto - Guard Dog", () => {
//   It.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [plutoGuardDog],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(plutoGuardDog);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It.skip("BRAVO While this character has no damage, he gets +4 {S}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: plutoGuardDog.cost,
//       Play: [plutoGuardDog],
//       Hand: [plutoGuardDog],
//     });
//
//     Await testEngine.playCard(plutoGuardDog);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
