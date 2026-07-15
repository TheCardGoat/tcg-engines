// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CruellaDeVilPerfectlyWretched,
//   GastonIntellectualPowerhouse,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { sardineCan } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sardine Can", () => {
//   It("**FLIGHT CABIN** Your exerted characters gain **Ward**. _(Opponents can’t choose them except to challenge.)_", () => {
//     Const testStore = new TestStore({
//       Play: [
//         SardineCan,
//         GastonIntellectualPowerhouse,
//         CruellaDeVilPerfectlyWretched,
//       ],
//     });
//
//     Const target = testStore.getByZoneAndId(
//       "play",
//       GastonIntellectualPowerhouse.id,
//     );
//     Const anotherTarget = testStore.getByZoneAndId(
//       "play",
//       CruellaDeVilPerfectlyWretched.id,
//     );
//
//     [target, anotherTarget].forEach((character) => {
//       Expect(character.hasWard).toBe(false);
//     });
//
//     [target, anotherTarget].forEach((character) => {
//       Character.updateCardMeta({ exerted: true });
//       Expect(character.hasWard).toBe(true);
//     });
//   });
// });
//
