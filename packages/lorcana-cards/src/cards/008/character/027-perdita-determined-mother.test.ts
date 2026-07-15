// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { cruellaDeVilFashionableCruiser } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   DalmatianPuppyTailWagger,
//   PatchPlayfulPup,
//   PerditaDeterminedMother,
//   RollyChubbyPuppy,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Perdita - Determined Mother", () => {
//   It("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Perdita.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [perditaDeterminedMother],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(perditaDeterminedMother);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("QUICK, EVERYONE HIDE When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: perditaDeterminedMother.cost,
//       Hand: [perditaDeterminedMother],
//       Discard: [
//         RollyChubbyPuppy,
//         PatchPlayfulPup,
//         DalmatianPuppyTailWagger,
//         CruellaDeVilFashionableCruiser,
//       ],
//     });
//
//     Await testEngine.playCard(perditaDeterminedMother);
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getCardModel(rollyChubbyPuppy).zone).toBe("inkwell");
//     Expect(testEngine.getCardModel(rollyChubbyPuppy).meta.exerted).toBe(true);
//
//     Expect(testEngine.getCardModel(patchPlayfulPup).zone).toBe("inkwell");
//     Expect(testEngine.getCardModel(patchPlayfulPup).meta.exerted).toBe(true);
//
//     Expect(testEngine.getCardModel(dalmatianPuppyTailWagger).zone).toBe(
//       "inkwell",
//     );
//     Expect(testEngine.getCardModel(dalmatianPuppyTailWagger).meta.exerted).toBe(
//       True,
//     );
//
//     Expect(testEngine.getCardModel(cruellaDeVilFashionableCruiser).zone).toBe(
//       "discard",
//     );
//     Expect(
//       TestEngine.getCardModel(cruellaDeVilFashionableCruiser).meta.exerted,
//     ).toBeFalsy();
//   });
// });
//
