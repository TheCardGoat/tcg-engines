// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AladdinVigilantGuard,
//   JimDearBelovedHusband,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Aladdin - Vigilant Guard", () => {
//   It("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [aladdinVigilantGuard],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(aladdinVigilantGuard);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It("SAFE PASSAGE Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: aladdinVigilantGuard.cost + jimDearBelovedHusband.cost,
//       Play: [aladdinVigilantGuard, jimDearBelovedHusband],
//     });
//
//     Const aladdin = testEngine.getCardModel(aladdinVigilantGuard);
//     Const jim = testEngine.getCardModel(jimDearBelovedHusband);
//
//     Aladdin.meta.damage = 2;
//     Expect(aladdin.meta.damage).toBe(2);
//
//     Jim.quest();
//
//     Await testEngine.resolveOptionalAbility();
//     Expect(aladdin.meta.damage).toBe(0);
//   });
// });
//
