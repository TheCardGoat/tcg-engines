// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PerditaDeterminedMother,
//   RollyChubbyPuppy,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rolly - Chubby Puppy", () => {
//   It("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [rollyChubbyPuppy],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(rollyChubbyPuppy);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
//
//   It("ADORABLE ANTICS When you play this character, you may put a character card from your discard in your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rollyChubbyPuppy.cost,
//       Hand: [rollyChubbyPuppy],
//       Discard: [perditaDeterminedMother],
//     });
//
//     Await testEngine.playCard(rollyChubbyPuppy);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [perditaDeterminedMother] });
//     Expect(testEngine.getCardModel(perditaDeterminedMother).zone).toBe(
//       "inkwell",
//     );
//     Expect(testEngine.getCardModel(perditaDeterminedMother).meta.exerted).toBe(
//       True,
//     );
//   });
//
//   It("ADORABLE ANTICS When you play this character, you may put a character card from your discard in your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rollyChubbyPuppy.cost,
//       Hand: [rollyChubbyPuppy],
//       Discard: [perditaDeterminedMother],
//     });
//
//     Await testEngine.playCard(rollyChubbyPuppy);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [perditaDeterminedMother] });
//
//     Expect(testEngine.getCardModel(perditaDeterminedMother).zone).toBe(
//       "inkwell",
//     );
//     Expect(testEngine.getCardModel(perditaDeterminedMother).meta.exerted).toBe(
//       True,
//     );
//   });
// });
//
