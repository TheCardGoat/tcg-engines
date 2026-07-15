// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { describe, expect, it } from "@jest/globals";
// Import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { calhounMarineSergeant } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Calhoun - Marine Sergeant", () => {
//   Describe("**LEVEL UP** During your turn, whenever this character banishes another character in a challenge, gain 2 lore.", () => {
//     It("should gain 2 lore when banishes another character in a challenge during your turn", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [calhounMarineSergeant],
//         },
//         {
//           Play: [goonsMaleficent],
//         },
//       );
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         CalhounMarineSergeant.id,
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         GoonsMaleficent.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//       Attacker.challenge(defender);
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(2);
//       Expect(defender.zone).toEqual("discard");
//       Expect(attacker.damage).toBe(1);
//     });
//   });
// });
//
