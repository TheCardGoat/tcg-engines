// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { gastonBaritoneBully } from "@lorcanito/lorcana-engine/cards/002/characters/008-gaston-baritone-bully";
// Import {
//   ArielSingingMermaid,
//   LittleJohnSirReginald,
// } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Little John - Sir Reginald", () => {
//   It.skip("WHAT A BEAUTIFUL BRAWL! When you play this character, choose one:", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: littleJohnSirReginald.cost,
//       Hand: [littleJohnSirReginald],
//     });
//
//     Await testEngine.playCard(littleJohnSirReginald);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It("- Chosen Hero character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: littleJohnSirReginald.cost,
//       Play: [arielSingingMermaid],
//       Hand: [littleJohnSirReginald],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(littleJohnSirReginald);
//     Const target = testEngine.getCardModel(arielSingingMermaid);
//
//     Await testEngine.playCard(
//       CardUnderTest,
//       {
//         Mode: "1",
//       },
//       True,
//     );
//
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasResist).toBe(true);
//   });
//
//   It("- Deal 2 damage to chosen Villain character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: littleJohnSirReginald.cost,
//         Hand: [littleJohnSirReginald],
//       },
//       {
//         Play: [gastonBaritoneBully],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(littleJohnSirReginald);
//     Const target = testEngine.getCardModel(gastonBaritoneBully);
//
//     Await testEngine.playCard(
//       CardUnderTest,
//       {
//         Mode: "2",
//       },
//       True,
//     );
//
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.damage).toBe(2);
//   });
// });
//
