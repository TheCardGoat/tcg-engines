// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { packTactics } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import {
//   CinderellaBallroomSensation,
//   EudoraAccomplishedSeamstress,
//   GastonBaritoneBully,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pack Tactics", () => {
//   It("Gain 1 lore for each damaged character opponents have in play.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: packTactics.cost,
//         Hand: [packTactics],
//       },
//       {
//         Play: [
//           GastonBaritoneBully,
//           EudoraAccomplishedSeamstress,
//           CinderellaBallroomSensation,
//         ],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", packTactics.id);
//
//     Const target = testStore.getByZoneAndId(
//       "play",
//       GastonBaritoneBully.id,
//       "player_two",
//     );
//     Const target2 = testStore.getByZoneAndId(
//       "play",
//       EudoraAccomplishedSeamstress.id,
//       "player_two",
//     );
//     Const target3 = testStore.getByZoneAndId(
//       "play",
//       CinderellaBallroomSensation.id,
//       "player_two",
//     );
//
//     [target3, target2, target].forEach((target) => {
//       Target.updateCardDamage(1);
//     });
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.getPlayerLore()).toBe(3);
//   });
// });
//
