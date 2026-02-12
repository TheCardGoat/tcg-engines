// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FidgetRatigansHenchman,
//   LadyTremaineImperiousQueen,
//   PrinceJohnGreediestOfAll,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Lady Tremaine - Imperious Queen", () => {
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Play: [ladyTremaineImperiousQueen],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       LadyTremaineImperiousQueen.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("**POWER TO RULE AT LAST** When you play this character, each opponent chooses and banishes one of their characters.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: ladyTremaineImperiousQueen.cost,
//         Hand: [ladyTremaineImperiousQueen],
//       },
//       {
//         Play: [fidgetRatigansHenchman],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       LadyTremaineImperiousQueen.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       FidgetRatigansHenchman.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.changePlayer().resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("discard");
//   });
//   It("Opponent being able to choose their own character with ward.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: ladyTremaineImperiousQueen.cost,
//         Hand: [ladyTremaineImperiousQueen],
//       },
//       {
//         Play: [princeJohnGreediestOfAll],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       LadyTremaineImperiousQueen.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       PrinceJohnGreediestOfAll.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.changePlayer().resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("discard");
//   });
// });
//
