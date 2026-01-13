// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   agustinMadrigalClumsyDad,
//   arielSingingMermaid,
//   daisyDuckLovelyLady,
//   namaariHeirOfFang,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Namaari, Heir of Fang - Two-Weapon Fighting", () => {
//   it("During your turn, deals damage to another chosen character", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: namaariHeirOfFang.cost,
//         play: [namaariHeirOfFang],
//       },
//       {
//         play: [arielSingingMermaid, daisyDuckLovelyLady],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       namaariHeirOfFang.id,
//     );
//
//     const defender = testStore.getCard(arielSingingMermaid);
//     const target1 = testStore.getCard(daisyDuckLovelyLady);
//
//     defender.updateCardMeta({ exerted: true });
//
//     cardUnderTest.challenge(defender);
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({ targets: [target1] });
//
//     [defender, target1].forEach((target) => {
//       expect(target.damage).toBe(cardUnderTest.strength);
//     });
//   });
//
//   it("During opponent's turn", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [agustinMadrigalClumsyDad],
//       },
//       {
//         play: [namaariHeirOfFang],
//       },
//     );
//
//     const cardUnderTest = testEngine.getCardModel(namaariHeirOfFang);
//     const attacker = testEngine.getCardModel(agustinMadrigalClumsyDad);
//
//     cardUnderTest.updateCardMeta({ exerted: true });
//
//     await testEngine.challenge({ attacker, defender: cardUnderTest });
//     expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
