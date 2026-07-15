// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GastonArrogantHunter,
//   LiloMakingAWish,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/027-hakuna-matata";
// Import { recordPlayer } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Record Player", () => {
//   It("**LOOK AT THIS!** Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: hakunaMatata.cost,
//       Hand: [hakunaMatata],
//       Play: [recordPlayer, gastonArrogantHunter],
//     });
//
//     Const target = testStore.getCard(gastonArrogantHunter);
//     Const trigger = testStore.getCard(hakunaMatata);
//
//     Trigger.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toEqual(gastonArrogantHunter.strength - 2);
//   });
//
//   It("**HIT PARADE** Your characters named Stitch count as having +1 cost to sing songs.", () => {
//     Const testStore = new TestStore({
//       Inkwell: recordPlayer.cost,
//       Play: [recordPlayer, stichtNewDog, liloMakingAWish],
//     });
//
//     Const cardUnderTest = testStore.getCard(stichtNewDog);
//     Const anotherCard = testStore.getCard(liloMakingAWish);
//
//     Expect(cardUnderTest.singerCost).toEqual(stichtNewDog.cost + 1);
//     Expect(cardUnderTest.cost).toEqual(stichtNewDog.cost);
//     Expect(anotherCard.singerCost).toEqual(liloMakingAWish.cost);
//   });
// });
//
