// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArgesTheCyclops,
//   ArielSonicWarrior,
//   LiShangValorousGeneral,
//   SisuEmpoweredSibling,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Li Shang - Valorous General", () => {
//   It("has Shift ability", () => {
//     Const testStore = new TestStore({
//       Play: [liShangValorousGeneral, sisuEmpoweredSibling, argesTheCyclops],
//     });
//
//     Const cardUnderTest = testStore.getCard(liShangValorousGeneral);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("LEAD THE CHARGE: Your characters with 4 {S} or more get +1 {L}", () => {
//     Const testStore = new TestStore({
//       Play: [
//         LiShangValorousGeneral,
//         ArgesTheCyclops,
//         SisuEmpoweredSibling,
//         ArielSonicWarrior,
//       ],
//     });
//
//     Const strong1 = testStore.getCard(argesTheCyclops);
//     Const strong2 = testStore.getCard(sisuEmpoweredSibling);
//     Const weak = testStore.getCard(arielSonicWarrior);
//
//     Expect(strong1.lore).toBe(argesTheCyclops.lore + 1);
//     Expect(strong2.lore).toBe(sisuEmpoweredSibling.lore + 1);
//     Expect(weak.lore).toBe(arielSonicWarrior.lore);
//   });
// });
//
