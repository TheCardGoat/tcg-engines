// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PrinceEricUrsulasGroom,
//   UrsulaVanessa,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Prince Eric - Ursula's Groom", () => {
//   It("****UNDER VANESSA'S SPELL** While you have a character named Ursula in play, this character gains **Bodyguard** and gets +2 {W}️. _(An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", async () => {
//     // Setup test with only Prince Eric in play
//     Const testEngine = new TestEngine({
//       Inkwell: princeEricUrsulasGroom.cost,
//       Play: [princeEricUrsulasGroom],
//     });
//
//     Const ericCard = testEngine.getCardModel(princeEricUrsulasGroom);
//
//     // Test initial state (without Ursula)
//     Expect(ericCard.hasBodyguard).toBe(false);
//     Expect(ericCard.willpower).toBe(princeEricUrsulasGroom.willpower);
//
//     // Setup test with both Prince Eric and Ursula in play
//     Const testEngineWithUrsula = new TestEngine({
//       Inkwell: princeEricUrsulasGroom.cost,
//       Play: [princeEricUrsulasGroom, ursulaVanessa],
//     });
//
//     Const ericCardWithUrsula = testEngineWithUrsula.getCardModel(
//       PrinceEricUrsulasGroom,
//     );
//
//     // Test state with Ursula in play
//     Expect(ericCardWithUrsula.hasBodyguard).toBe(true);
//     Expect(ericCardWithUrsula.willpower).toBe(
//       PrinceEricUrsulasGroom.willpower + 2,
//     );
//   });
// });
//
