// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AgustinMadrigalClumsyDad,
//   ArielSingingMermaid,
//   DaisyDuckLovelyLady,
//   NamaariHeirOfFang,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Namaari, Heir of Fang - Two-Weapon Fighting", () => {
//   It("During your turn, deals damage to another chosen character", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: namaariHeirOfFang.cost,
//         Play: [namaariHeirOfFang],
//       },
//       {
//         Play: [arielSingingMermaid, daisyDuckLovelyLady],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       NamaariHeirOfFang.id,
//     );
//
//     Const defender = testStore.getCard(arielSingingMermaid);
//     Const target1 = testStore.getCard(daisyDuckLovelyLady);
//
//     Defender.updateCardMeta({ exerted: true });
//
//     CardUnderTest.challenge(defender);
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [target1] });
//
//     [defender, target1].forEach((target) => {
//       Expect(target.damage).toBe(cardUnderTest.strength);
//     });
//   });
//
//   It("During opponent's turn", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [agustinMadrigalClumsyDad],
//       },
//       {
//         Play: [namaariHeirOfFang],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(namaariHeirOfFang);
//     Const attacker = testEngine.getCardModel(agustinMadrigalClumsyDad);
//
//     CardUnderTest.updateCardMeta({ exerted: true });
//
//     Await testEngine.challenge({ attacker, defender: cardUnderTest });
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
