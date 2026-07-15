// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielSpectacularSinger,
//   DrFacilierRemarkable,
//   HeiheiBoatSnack,
//   YzmaAlchemist,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dr. Facilier - Remarkable Gentleman", () => {
//   It("**DREAMS MADE REAL** Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.", () => {
//     Const testStore = new TestStore({
//       Inkwell: hakunaMatata.cost,
//       Hand: [hakunaMatata],
//       Play: [drFacilierRemarkable],
//       Deck: [heiheiBoatSnack, yzmaAlchemist, arielSpectacularSinger],
//     });
//
//     Const target = testStore.getByZoneAndId("hand", hakunaMatata.id);
//     Const first = testStore.getByZoneAndId("deck", arielSpectacularSinger.id);
//     Const second = testStore.getByZoneAndId("deck", yzmaAlchemist.id);
//
//     Target.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ scry: { bottom: [first], top: [second] } });
//
//     Const deck = testStore.store.tableStore.getPlayerZoneCards(
//       "player_one",
//       "deck",
//     );
//
//     Expect(deck[0]).toEqual(first);
//     Expect(deck[deck.length - 1]).toEqual(second);
//   });
// });
//
