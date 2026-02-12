// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { andThenAlongCameZeus } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import {
//   MagicaDeSpellAmbitiousWitch,
//   TheFirebirdForceOfDestruction,
//   UrsulaDeceiver,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ursula - Deceiver", () => {
//   It("**YOU'LL NEVER EVEN MISS IT** When you play this character, chosen opponent reveals their hand and discards a song card of your choice.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: ursulaDeceiver.cost,
//         Hand: [ursulaDeceiver],
//       },
//       {
//         Hand: [
//           MagicaDeSpellAmbitiousWitch,
//           TheFirebirdForceOfDestruction,
//           AndThenAlongCameZeus,
//         ],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", ursulaDeceiver.id);
//     Const target = testStore.getByZoneAndId(
//       "hand",
//       AndThenAlongCameZeus.id,
//       "player_two",
//     );
//     Const targets = [
//       TestStore.getByZoneAndId(
//         "hand",
//         MagicaDeSpellAmbitiousWitch.id,
//         "player_two",
//       ),
//       TestStore.getByZoneAndId(
//         "hand",
//         TheFirebirdForceOfDestruction.id,
//         "player_two",
//       ),
//     ];
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//     Targets.forEach((card) => {
//       Expect(card.meta.revealed).toEqual(true);
//     });
//   });
// });
//
