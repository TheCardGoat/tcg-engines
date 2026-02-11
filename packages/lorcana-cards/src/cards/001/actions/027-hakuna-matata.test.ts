// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MagicBroomBucketBrigade,
//   MoanaOfMotunui,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hakuna Matata", () => {
//   It("Heals all characters", () => {
//     Const cardsInHand = [
//       MagicBroomBucketBrigade,
//       TeKaTheBurningOne,
//       MoanaOfMotunui,
//     ];
//     Const testStore = new TestStore({
//       Play: cardsInHand,
//       Inkwell: hakunaMatata.cost,
//       Hand: [hakunaMatata],
//     });
//     CardsInHand.forEach((card, index) => {
//       Const cardModel = testStore.getByZoneAndId("play", card.id);
//       CardModel.updateCardMeta({ damage: 3 });
//       Expect(cardModel.meta).toEqual(expect.objectContaining({ damage: 3 }));
//     });
//
//     TestStore.store.playCardFromHand(
//       TestStore.getByZoneAndId("hand", hakunaMatata.id).instanceId,
//     );
//
//     CardsInHand.forEach((card) => {
//       Const cardModel = testStore.getByZoneAndId("play", card.id);
//       Expect(cardModel.meta.damage).toBeFalsy();
//     });
//   });
// });
//
