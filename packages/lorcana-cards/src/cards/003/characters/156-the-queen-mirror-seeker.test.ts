// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChiefTui,
//   HeiheiBoatSnack,
//   LiloMakingAWish,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { theQueenMirrorSeeker } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
// Import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
//
// Describe("The Queen - Mirror Seeker", () => {
//   It("**CALCULATING AND VAIN** Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.", () => {
//     Const testStore = new TestStore({
//       Inkwell: theQueenMirrorSeeker.cost,
//       Deck: [liloMakingAWish, moanaOfMotunui, chiefTui, heiheiBoatSnack],
//       Play: [theQueenMirrorSeeker],
//     });
//
//     // Retrieve the card from the "play" zone
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TheQueenMirrorSeeker.id,
//     ) as CardModel;
//     Const one = testStore.getByZoneAndId(
//       "deck",
//       HeiheiBoatSnack.id,
//     ) as CardModel;
//     Const two = testStore.getByZoneAndId("deck", chiefTui.id) as CardModel;
//     Const three = testStore.getByZoneAndId(
//       "deck",
//       MoanaOfMotunui.id,
//     ) as CardModel;
//
//     CardUnderTest.quest(); // Trigger the questing ability
//
//     // Handle the optional ability
//     TestStore.resolveOptionalAbility();
//
//     // Assume the player chooses to reorder the top 3 cards as chiefTui, heiheiBoatSnack, moanaOfMotunui
//     Const top: CardModel[] = [two, one, three];
//
//     TestStore.resolveTopOfStack({ scry: { top } }, true); // Set skipAssertion to true
//
//     Expect(
//       TestStore.store.tableStore
//         .getPlayerZoneCards("player_one", "deck")
//         .map((card) => card.lorcanitoCard?.name),
//     ).toEqual([
//       LiloMakingAWish.name,
//       ...top.map((card) => card.lorcanitoCard?.name),
//     ]);
//   });
// });
//
