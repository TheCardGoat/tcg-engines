// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   HueyReliableLeader,
//   MagicaDeSpellShadowForm,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Magica De Spell - Shadow Form", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [magicaDeSpellShadowForm],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(magicaDeSpellShadowForm);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("DANCE OF DARKNESS When you play this character, you may return one of your other characters to your hand to draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: magicaDeSpellShadowForm.cost,
//       Hand: [magicaDeSpellShadowForm],
//       Play: [deweyLovableShowoff],
//       Deck: [hueyReliableLeader],
//     });
//
//     Await testEngine.playCard(magicaDeSpellShadowForm, {
//       AcceptOptionalLayer: true,
//       Targets: [deweyLovableShowoff],
//     });
//
//     Await expect(testEngine.getCardModel(deweyLovableShowoff).zone).toBe(
//       "hand",
//     );
//     Await expect(testEngine.getCardModel(hueyReliableLeader).zone).toBe("hand");
//   });
//
//   It("DANCE OF DARKNESS When you play this character, you may return one of your OTHER characters to your hand to draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: magicaDeSpellShadowForm.cost,
//       Hand: [magicaDeSpellShadowForm],
//       Play: [],
//       Deck: [hueyReliableLeader],
//     });
//
//     Await testEngine.playCard(
//       MagicaDeSpellShadowForm,
//       {
//         AcceptOptionalLayer: true,
//         Targets: [magicaDeSpellShadowForm],
//       },
//       True,
//     );
//
//     Await expect(testEngine.getCardModel(magicaDeSpellShadowForm).zone).toBe(
//       "play",
//     );
//   });
// });
//
