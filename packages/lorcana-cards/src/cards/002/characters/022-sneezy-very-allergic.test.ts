// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FairyGodmotherHereToHelp,
//   HappyGoodNatured,
//   SneezyVeryAllergic,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sneezy - Very Allergic", () => {
//   Describe("**AH-CHOO!** Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.", () => {
//     It("playing Sneezy", () => {
//       Const testStore = new TestStore({
//         Inkwell: sneezyVeryAllergic.cost,
//         Hand: [sneezyVeryAllergic],
//         Play: [fairyGodmotherHereToHelp],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         SneezyVeryAllergic.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         FairyGodmotherHereToHelp.id,
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.strength).toBe(fairyGodmotherHereToHelp.strength - 1);
//     });
//
//     It("playing another Seven Dwarfs character", () => {
//       Const testStore = new TestStore({
//         Inkwell: happyGoodNatured.cost,
//         Hand: [happyGoodNatured],
//         Play: [fairyGodmotherHereToHelp, sneezyVeryAllergic],
//       });
//
//       Const dwarf = testStore.getByZoneAndId("hand", happyGoodNatured.id);
//       Const target = testStore.getByZoneAndId(
//         "play",
//         FairyGodmotherHereToHelp.id,
//       );
//
//       Dwarf.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.strength).toBe(fairyGodmotherHereToHelp.strength - 1);
//     });
//
//     It("playing another character, Not a seven dwarfs char", () => {
//       Const testStore = new TestStore({
//         Inkwell: fairyGodmotherHereToHelp.cost,
//         Hand: [fairyGodmotherHereToHelp],
//         Play: [sneezyVeryAllergic],
//       });
//
//       Const nonDwarf = testStore.getByZoneAndId(
//         "hand",
//         FairyGodmotherHereToHelp.id,
//       );
//
//       NonDwarf.playFromHand();
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It("opponent playing a seven dwarfs char", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: happyGoodNatured.cost,
//           Hand: [happyGoodNatured],
//         },
//         { play: [sneezyVeryAllergic] },
//       );
//
//       Const dwarf = testStore.getByZoneAndId("hand", happyGoodNatured.id);
//
//       Dwarf.playFromHand();
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
