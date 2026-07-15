// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { sisuEmboldenedWarrior } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sisu - Emboldened Warrior", () => {
//   It("**SURGE OF POWER** This character gets +1 {S} for each card in opponent's hands.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: sisuEmboldenedWarrior.cost,
//         Play: [sisuEmboldenedWarrior],
//       },
//       {
//         Hand: [
//           SisuEmboldenedWarrior,
//           SisuEmboldenedWarrior,
//           SisuEmboldenedWarrior,
//         ],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       SisuEmboldenedWarrior.id,
//     );
//
//     Expect(cardUnderTest.strength).toEqual(
//       SisuEmboldenedWarrior.strength +
//         TestStore.getZonesCardCount("player_two").hand,
//     );
//   });
// });
//
