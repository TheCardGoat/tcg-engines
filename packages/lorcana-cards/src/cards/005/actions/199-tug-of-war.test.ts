// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyBraveLittleTailor,
//   SimbaProtectiveCub,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { tugofwar } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tug-of-War", () => {
//   It("Choose one: Deal 1 damage to each opposing character without **Evasive**. Deal 3 damage to each opposing character with **Evasive**.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: tugofwar.cost,
//         Hand: [tugofwar],
//       },
//       {
//         Play: [mickeyBraveLittleTailor, simbaProtectiveCub],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", tugofwar.id);
//     Const target1 = testStore.getByZoneAndId(
//       "play",
//       MickeyBraveLittleTailor.id,
//       "player_two",
//     );
//     Const target2 = testStore.getByZoneAndId(
//       "play",
//       SimbaProtectiveCub.id,
//       "player_two",
//     );
//
//     Expect(target1.damage).toBe(0);
//     Expect(target2.damage).toBe(0);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ mode: "1" }); // Choose first mode - 1 damage to characters without Evasive
//
//     // Test that 1 damage was dealt to characters without Evasive (Simba doesn't have Evasive)
//     Expect(target2.damage).toBe(1); // Simba should take damage
//     Expect(testStore.getZonesCardCount().discard).toBe(1); // Tug-of-War goes to discard
//   });
// });
//
