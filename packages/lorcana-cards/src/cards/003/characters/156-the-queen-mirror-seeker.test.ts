// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// import { describe, expect, it } from "@jest/globals";
// import {
//   chiefTui,
//   heiheiBoatSnack,
//   liloMakingAWish,
//   moanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { theQueenMirrorSeeker } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
// import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
//
// describe("The Queen - Mirror Seeker", () => {
//   it("**CALCULATING AND VAIN** Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.", () => {
//     const testStore = new TestStore({
//       inkwell: theQueenMirrorSeeker.cost,
//       deck: [liloMakingAWish, moanaOfMotunui, chiefTui, heiheiBoatSnack],
//       play: [theQueenMirrorSeeker],
//     });
//
//     // Retrieve the card from the "play" zone
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       theQueenMirrorSeeker.id,
//     ) as CardModel;
//     const one = testStore.getByZoneAndId(
//       "deck",
//       heiheiBoatSnack.id,
//     ) as CardModel;
//     const two = testStore.getByZoneAndId("deck", chiefTui.id) as CardModel;
//     const three = testStore.getByZoneAndId(
//       "deck",
//       moanaOfMotunui.id,
//     ) as CardModel;
//
//     cardUnderTest.quest(); // Trigger the questing ability
//
//     // Handle the optional ability
//     testStore.resolveOptionalAbility();
//
//     // Assume the player chooses to reorder the top 3 cards as chiefTui, heiheiBoatSnack, moanaOfMotunui
//     const top: CardModel[] = [two, one, three];
//
//     testStore.resolveTopOfStack({ scry: { top } }, true); // Set skipAssertion to true
//
//     expect(
//       testStore.store.tableStore
//         .getPlayerZoneCards("player_one", "deck")
//         .map((card) => card.lorcanitoCard?.name),
//     ).toEqual([
//       liloMakingAWish.name,
//       ...top.map((card) => card.lorcanitoCard?.name),
//     ]);
//   });
// });
//
