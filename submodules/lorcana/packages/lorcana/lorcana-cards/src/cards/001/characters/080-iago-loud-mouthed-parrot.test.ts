// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   IagoLoudMouthedParrot,
//   JohnSilverAlienPirate,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Iago Silver - Loud-Mouthed Parrot", () => {
//   It("YOU GOT A PROBLEM? - {E} − Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_", () => {
//     Const testStore = new TestStore(
//       {
//         Deck: 2,
//         Inkwell: iagoLoudMouthedParrot.cost,
//         Play: [iagoLoudMouthedParrot],
//       },
//       {
//         Deck: 2,
//         Play: [johnSilverAlienPirate],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       IagoLoudMouthedParrot.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       JohnSilverAlienPirate.id,
//       "player_two",
//     );
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     // Character gets "Reckless" on their turn
//     Expect(target.hasReckless).toBeFalsy();
//     TestStore.passTurn();
//     Expect(target.hasReckless).toBeTruthy();
//   });
// });
//
